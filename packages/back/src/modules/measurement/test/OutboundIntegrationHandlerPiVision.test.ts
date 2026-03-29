import { EApiFailCode, UtilDate } from "common";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { IContextCore } from "@m/core/interfaces/IContext";

import { OutboundIntegrationHandlerAvevaPi } from "../outbound-integration-handlers/OutboundIntegrationHandlerAvevaPi";

describe("OutboundIntegrationHandlerAvevaPi", () => {
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
          url === "http://pi.example.com/streams/test-web-id/value"
            ? {
                Timestamp: "2014-07-22T14:00:00Z",
                UnitsAbbreviation: "m",
                Good: true,
                Questionable: false,
                Substituted: false,
                Annotated: false,
                Value: 12.3,
              }
            : {
                Timestamp: "2014-07-22T14:00:00Z",
                UnitsAbbreviation: "m",
                Good: false,
                Questionable: false,
                Substituted: false,
                Annotated: false,
                Value: { Error: "Some error" },
              };

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

  it("should fetch from pi server", async () => {
    const result = await OutboundIntegrationHandlerAvevaPi.run(
      context,
      { period: "DAILY", outputKeys: ["test-web-id", "bad-id"] },
      {
        baseUrl: "http://pi.example.com/",
        username: "test-user",
        password: "test-password",
      },
    );

    expect(result).toStrictEqual([
      {
        outputKey: "test-web-id",
        data: {
          datetime: "2014-07-22T14:00:00.000Z",
          value: 12.3,
        },
        info: {
          Good: true,
          Timestamp: "2014-07-22T14:00:00Z",
          UnitsAbbreviation: "m",
          Value: 12.3,
        },
      },
      {
        outputKey: "bad-id",
        info: {
          error: "Pi Vision responded with unexpected value structure.",
          rawValue: {
            Timestamp: "2014-07-22T14:00:00Z",
            UnitsAbbreviation: "m",
            Good: false,
            Questionable: false,
            Substituted: false,
            Annotated: false,
            Value: { Error: "Some error" },
          },
        },
      },
    ]);
  });

  it("should throw error if no output key is given through options", async () => {
    await expect(
      OutboundIntegrationHandlerAvevaPi.run(
        context,
        { period: "DAILY" },
        {
          baseUrl: "http://pi.example.com/",
          username: "test-user",
          password: "test-password",
        },
      ),
    ).rejects.toThrow(EApiFailCode.BAD_REQUEST);
  });
});
