import { EApiFailCode, UtilDate } from "common";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextCore } from "@m/core/interfaces/IContext";

import { OutboundIntegrationHandlerOpenWeather } from "../outbound-integration-handlers/OutboundIntegrationHandlerOpenWeather";

describe("OutboundIntegrationHandlerOpenWeather", () => {
  let context: IContextCore;

  beforeEach(() => {
    context = UtilTest.createTestContext();
    context.env.OPEN_WEATHER_API_TOKEN = "mocked-openweather-token";
  });

  beforeAll(() => {
    vi.spyOn(UtilDate, "getYesterdayUtcIsoDate").mockImplementation(() => {
      return "2025-04-16";
    });

    vi.spyOn(global, "fetch").mockImplementation(
      (url: string | URL | RequestInfo): Promise<Response> => {
        if (typeof url !== "string") {
          throw new Error("Unsupported test fetch usage.");
        }

        let payload: unknown;

        if (url.includes("api.openweathermap.org/data/2.5/forecast")) {
          payload = {
            city: { name: "Mersin", country: "TR" },
            list: [
              {
                main: { temp: 20, humidity: 60 },
                rain: { "3h": 1.5 },
              },
              {
                main: { temp: 24, humidity: 50 },
              },
            ],
          };
        } else if (url.includes("api.openweathermap.org/data/2.5/weather")) {
          payload = {
            name: "Mersin",
            sys: { country: "TR" },
            dt: 1744761600,
            main: { temp: 22, humidity: 55 },
            rain: { "1h": 0.5 },
          };
        }

        if (!payload) {
          throw new Error(`Url response is not found. Url: ${url}`);
        }

        return Promise.resolve(
          new Response(JSON.stringify(payload), {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        );
      },
    );
  });

  it("should return daily with forecast average for CITY", async () => {
    const result = await OutboundIntegrationHandlerOpenWeather.run(
      context,
      { period: "DAILY" },
      {
        queryType: "CITY",
        query: "Mersin",
        baseTemp: 18.3,
      },
    );

    expect(result).toMatchSnapshot();
  });

  it("should throw error for unsupported period", async () => {
    await expect(
      OutboundIntegrationHandlerOpenWeather.run(
        context,
        { period: "HOURLY" },
        {
          queryType: "CITY",
          query: "Mersin",
          baseTemp: 18.3,
        },
      ),
    ).rejects.toThrowError(EApiFailCode.BAD_REQUEST);
  });

  it("should throw error when api token is missing", async () => {
    context.env.OPEN_WEATHER_API_TOKEN = undefined;

    await expect(
      OutboundIntegrationHandlerOpenWeather.run(
        context,
        { period: "DAILY" },
        {
          queryType: "CITY",
          query: "Mersin",
          baseTemp: 18.3,
        },
      ),
    ).rejects.toThrowError(EApiFailCode.INTERNAL);
  });
});
