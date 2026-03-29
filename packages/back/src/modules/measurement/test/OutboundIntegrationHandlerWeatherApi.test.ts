import { EApiFailCode, UtilDate } from "common";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextCore } from "@m/core/interfaces/IContext";

import { OutboundIntegrationHandlerWeatherApi } from "../outbound-integration-handlers/OutboundIntegrationHandlerWeatherApi";
import { TestHelperOutboundIntegrationHandlerWeatherApi } from "./TestHelperOutboundIntegrationHandlerWeatherApi";

describe("OutboundIntegrationHandlerWeather", () => {
  let context: IContextCore;
  beforeEach(() => {
    context = UtilTest.createTestContext();
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

        const payload =
          TestHelperOutboundIntegrationHandlerWeatherApi.urlPayloadMap[url];

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

  it("should return daily", async () => {
    const result = await OutboundIntegrationHandlerWeatherApi.run(
      context,
      { period: "DAILY" },
      { queryType: "CITY", query: "Mersin", baseTemp: 18.3 },
    );

    expect(result).toMatchSnapshot();
  });

  it("should return minutely", async () => {
    const result = await OutboundIntegrationHandlerWeatherApi.run(
      context,
      { period: "MINUTELY_15" },
      { queryType: "CITY", query: "Mersin", baseTemp: 18.3 },
    );

    expect(result).toMatchSnapshot();
  });

  it("should throw error for unsupported period", async () => {
    await expect(
      OutboundIntegrationHandlerWeatherApi.run(
        context,
        { period: "HOURLY" },
        { queryType: "CITY", query: "Mersin", baseTemp: 18.3 },
      ),
    ).rejects.toThrowError(EApiFailCode.BAD_REQUEST);
  });
});
