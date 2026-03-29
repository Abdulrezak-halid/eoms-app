import { EApiFailCode, UtilDate } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";

import {
  IOutboundIntegrationHandler,
  IOutboundIntegrationRunResultItem,
} from "../interfaces/IOutboundIntegrationHandler";
import { IWeatherQueryType } from "../interfaces/IWeatherQueryType";
import { TbOutboundIntegrationParamOpenWeather } from "../orm/TbOutboundIntegrationParamOpenWeather";

export const OutboundIntegrationHandlerOpenWeather: IOutboundIntegrationHandler<{
  queryType: IWeatherQueryType;
  query: string;
  baseTemp: number;
}> = {
  async get(c, orgId, id) {
    const [record] = await c.db
      .select({
        queryType: TbOutboundIntegrationParamOpenWeather.queryType,
        query: TbOutboundIntegrationParamOpenWeather.query,
        baseTemp: TbOutboundIntegrationParamOpenWeather.baseTemp,
      })
      .from(TbOutboundIntegrationParamOpenWeather)
      .where(
        and(
          eq(TbOutboundIntegrationParamOpenWeather.orgId, orgId),
          eq(TbOutboundIntegrationParamOpenWeather.subjectId, id),
        ),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "OpenWeather integration param is not found.",
      );
    }

    return record;
  },

  async create(c, orgId, id, param) {
    await c.db.insert(TbOutboundIntegrationParamOpenWeather).values({
      orgId,
      subjectId: id,
      queryType: param.queryType,
      query: param.query,
      baseTemp: param.baseTemp,
    });
  },

  async remove(c, orgId, id) {
    await c.db
      .delete(TbOutboundIntegrationParamOpenWeather)
      .where(
        and(
          eq(TbOutboundIntegrationParamOpenWeather.orgId, orgId),
          eq(TbOutboundIntegrationParamOpenWeather.subjectId, id),
        ),
      );
  },

  async run(c, o, p) {
    if (!c.env.OPEN_WEATHER_API_TOKEN) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "OpenWeather api token is not configured.",
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
      ? "https://api.openweathermap.org/data/2.5/forecast"
      : "https://api.openweathermap.org/data/2.5/weather";

    const url = new URL(apiUrl);

    url.searchParams.set("appid", c.env.OPEN_WEATHER_API_TOKEN!);
    url.searchParams.set("units", "metric");

    if (p.queryType === "LAT_LONG") {
      const [lat, lon] = p.query.split(",");
      url.searchParams.set("lat", lat?.trim() || "");
      url.searchParams.set("lon", lon?.trim() || "");
    } else {
      url.searchParams.set("q", p.query);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `OpenWeather API request failed with status ${response.status}`,
      );
    }

    const json = await response.json();
    const outputs: IOutboundIntegrationRunResultItem[] = [];

    if (isDaily) {
      const data = json as {
        city: { name: string; country: string };
        list: Array<{
          main: { temp: number; humidity: number };
          rain?: { "3h"?: number };
        }>;
      };

      const targetList = data.list.slice(0, 8);
      if (targetList.length > 0) {
        const datetime = `${UtilDate.getYesterdayUtcIsoDate()}T00:00:00.000Z`;

        let sumTemp = 0;
        let sumHumidity = 0;
        let totalRain = 0;

        for (const item of targetList) {
          sumTemp += item.main.temp;
          sumHumidity += item.main.humidity;
          totalRain += item.rain?.["3h"] || 0;
        }

        const count = targetList.length;
        const avgTemp = sumTemp / count;
        const humidity = sumHumidity / count;
        const rain = totalRain;

        const hdd = Math.max(p.baseTemp - avgTemp, 0);
        const cdd = Math.max(avgTemp - p.baseTemp, 0);

        const info = {
          location: data.city.name,
          country: data.city.country,
          source: "OpenWeather Free Forecast",
        };

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
        name: string;
        sys: { country: string };
        dt: number;
        main: { temp: number; humidity: number };
        rain?: { "1h"?: number };
      };

      const datetime = UtilDate.objToIsoDatetime(new Date(data.dt * 1000));

      const temp = data.main.temp;
      const rain = data.rain?.["1h"] || 0;
      const humidity = data.main.humidity;
      const hdd = Math.max(p.baseTemp - temp, 0);
      const cdd = Math.max(temp - p.baseTemp, 0);

      const info = {
        location: data.name,
        country: data.sys.country,
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
