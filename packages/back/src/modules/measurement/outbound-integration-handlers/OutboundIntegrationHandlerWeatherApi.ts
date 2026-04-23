import { EApiFailCode, UtilDate } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";

import {
  IOutboundIntegrationHandler,
  IOutboundIntegrationRunResultItem,
} from "../interfaces/IOutboundIntegrationHandler";
import { IWeatherQueryType } from "../interfaces/IWeatherQueryType";
import { TbOutboundIntegrationParamWeatherApi } from "../orm/TbOutboundIntegrationParamWeatherApi";

export const OutboundIntegrationHandlerWeatherApi: IOutboundIntegrationHandler<{
  queryType: IWeatherQueryType;
  query: string;
  baseTemp: number;
}> = {
  async get(c, orgId, id) {
    const [record] = await c.db
      .select({
        queryType: TbOutboundIntegrationParamWeatherApi.queryType,
        query: TbOutboundIntegrationParamWeatherApi.query,
        baseTemp: TbOutboundIntegrationParamWeatherApi.baseTemp,
      })
      .from(TbOutboundIntegrationParamWeatherApi)
      .where(
        and(
          eq(TbOutboundIntegrationParamWeatherApi.orgId, orgId),
          eq(TbOutboundIntegrationParamWeatherApi.subjectId, id),
        ),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Mock source integration param is not found.",
      );
    }

    return record;
  },

  async create(c, orgId, id, param) {
    await c.db.insert(TbOutboundIntegrationParamWeatherApi).values({
      orgId,
      subjectId: id,
      queryType: param.queryType,
      query: param.query,
      baseTemp: param.baseTemp,
    });
  },

  async remove(c, orgId, id) {
    await c.db
      .delete(TbOutboundIntegrationParamWeatherApi)
      .where(
        and(
          eq(TbOutboundIntegrationParamWeatherApi.orgId, orgId),
          eq(TbOutboundIntegrationParamWeatherApi.subjectId, id),
        ),
      );
  },

  async run(c, o, p) {
    if (!c.env.WEATHER_API_TOKEN) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Weather api token is not configured.",
      );
    }

    if (o.period !== "DAILY" && o.period !== "MINUTELY_15") {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Only DAILY, and MINUTELY_15 periods are supported.",
      );
    }

    const isDaily = o.period === "DAILY";

    const apiUrl = isDaily
      ? "https://api.weatherapi.com/v1/history.json"
      : "https://api.weatherapi.com/v1/current.json";

    const url = new URL(apiUrl);

    url.searchParams.set("key", c.env.WEATHER_API_TOKEN!);
    url.searchParams.set("q", p.query);
    url.searchParams.set("aqi", "no"); // Air quality data

    if (isDaily) {
      url.searchParams.append("dt", UtilDate.getYesterdayUtcIsoDate());
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Weather API request failed with status ${response.status}`,
      );
    }

    const json = await response.json();

    const outputs: IOutboundIntegrationRunResultItem[] = [];

    if (isDaily) {
      const data = json as {
        location: {
          name: string;
          region: string;
          country: string;
        };
        forecast: {
          forecastday: Array<{
            date: string;
            day: {
              avgtemp_c: number;
              totalprecip_mm: number;
              avghumidity: number;
            };
          }>;
        };
      };

      const info = {
        location: data.location.name,
        region: data.location.region,
        country: data.location.country,
      };

      for (const day of data.forecast.forecastday) {
        const datetime = `${day.date}T00:00:00.000Z`;

        const avgTemp = day.day.avgtemp_c;
        const rain = day.day.totalprecip_mm;
        const humidity = day.day.avghumidity;
        const hdd = Math.max(p.baseTemp - avgTemp, 0);
        const cdd = Math.max(avgTemp - p.baseTemp, 0);

        outputs.push({
          outputKey: "HDD",
          data: { value: hdd, datetime },
          info,
        });
        outputs.push({
          outputKey: "CDD",
          data: { value: cdd, datetime },
          info,
        });
        outputs.push({
          outputKey: "HUMIDITY",
          data: { value: humidity, datetime },
          info,
        });
        outputs.push({
          outputKey: "TEMPERATURE",
          data: { value: avgTemp, datetime },
          info,
        });
        outputs.push({
          outputKey: "RAIN",
          data: { value: rain, datetime },
          info,
        });
      }
    }

    // Hourly
    else {
      const data = json as {
        location: {
          name: string;
          region: string;
          country: string;
        };
        current: {
          last_updated_epoch: number;
          temp_c: number;
          precip_mm: number;
          humidity: number;
        };
      };

      const datetime = UtilDate.objToIsoDatetime(
        new Date(data.current.last_updated_epoch * 1000),
      );

      const temp = data.current.temp_c;
      const rain = data.current.precip_mm;
      const humidity = data.current.humidity;
      const hdd = Math.max(p.baseTemp - temp, 0);
      const cdd = Math.max(temp - p.baseTemp, 0);

      const info = {
        location: data.location.name,
        region: data.location.region,
        country: data.location.country,
      };

      outputs.push({ outputKey: "HDD", data: { value: hdd, datetime }, info });
      outputs.push({ outputKey: "CDD", data: { value: cdd, datetime }, info });
      outputs.push({
        outputKey: "HUMIDITY",
        data: { value: humidity, datetime },
        info,
      });
      outputs.push({
        outputKey: "TEMPERATURE",
        data: { value: temp, datetime },
        info,
      });
      outputs.push({
        outputKey: "RAIN",
        data: { value: rain, datetime },
        info,
      });
    }

    return outputs;
  },
};
