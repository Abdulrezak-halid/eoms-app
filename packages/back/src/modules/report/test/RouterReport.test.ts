import { EApiFailCode } from "common";
import { describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";

describe("E2E - RouterReport", () => {
  it("Create a report", async () => {
    const produceMock = vi
      .spyOn(ServiceMessageQueue, "produce")
      .mockResolvedValue(undefined);

    const { client, session } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/report/create", {
      params: { query: { tz: "Europe/Istanbul" } },
      body: {
        report: {
          title: {
            type: "PLAIN",
            value: "Test Report",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [session.userId],
          sections: [],
        },
        attachmentIds: [],
      },
      headers: { "accept-language": "en" },
      parseAs: "json",
    });

    expect(res).toBeApiOk();
    expect(res.data!).toHaveProperty("id");

    expect(produceMock).toHaveBeenCalledWith(
      "TEST_QUEUE_REPORT_RENDER",
      expect.any(Buffer),
    );

    // { id: string, html: buffer }
    const producedMessage = JSON.parse(produceMock.mock.calls[0][1].toString());
    expect(producedMessage.id).toBe(res.data?.id);
    expect(producedMessage).toHaveProperty("html");

    produceMock.mockRestore();
  });

  it("Get all reports", async () => {
    vi.spyOn(ServiceMessageQueue, "produce").mockResolvedValue(undefined);

    const { client, session } = await UtilTest.createClientLoggedIn();

    const report = await client.POST("/u/report/create", {
      params: { query: { tz: "Europe/Istanbul" } },
      body: {
        report: {
          title: {
            type: "PLAIN",
            value: "Test Report",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [session.userId],
          sections: [],
        },
        attachmentIds: [],
      },
      headers: { "accept-language": "en" },
      parseAs: "json",
    });

    expect(report).toBeApiOk();
    expect(report.data!).toHaveProperty("id");

    const res = await client.GET("/u/report/item");
    expect(res.data).toStrictEqual({
      records: [
        {
          id: report.data?.id,
          status: "PENDING",
          attachments: [],
          title: { type: "PLAIN", value: "Test Report" },
          dateEnd: "2025-08-31",
          dateStart: "2025-08-01",
          createdAt: expect.any(String),
        },
      ],
    });
  });

  it("Get report by id", async () => {
    vi.spyOn(ServiceMessageQueue, "produce").mockResolvedValue(undefined);

    const { client, session } = await UtilTest.createClientLoggedIn();

    const report = await client.POST("/u/report/create", {
      params: { query: { tz: "Europe/Istanbul" } },
      body: {
        report: {
          title: {
            type: "PLAIN",
            value: "Test Report",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [session.userId],
          sections: [],
        },
        attachmentIds: [],
      },
      headers: { "accept-language": "en" },
      parseAs: "json",
    });

    expect(report).toBeApiOk();
    expect(report.data!).toHaveProperty("id");

    const res = await client.GET("/u/report/item/{id}", {
      params: { path: { id: report.data!.id } },
    });

    expect(res.data).toStrictEqual({
      id: report.data?.id,
      config: {
        authorIds: [session.userId],
        dateEnd: "2025-08-31",
        dateStart: "2025-08-01",
        sections: [],
        title: { type: "PLAIN", value: "Test Report" },
      },
      createdAt: expect.any(String),
      status: "PENDING",
      attachments: [],
      title: { type: "PLAIN", value: "Test Report" },
      dateEnd: "2025-08-31",
      dateStart: "2025-08-01",
    });
  });

  it("Remove report", async () => {
    vi.spyOn(ServiceMessageQueue, "produce").mockResolvedValue(undefined);

    const { client, session } = await UtilTest.createClientLoggedIn();

    const report = await client.POST("/u/report/create", {
      params: { query: { tz: "Europe/Istanbul" } },
      body: {
        report: {
          title: {
            type: "PLAIN",
            value: "Test Report",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [session.userId],
          sections: [],
        },
        attachmentIds: [],
      },
      headers: { "accept-language": "en" },
      parseAs: "json",
    });

    expect(report).toBeApiOk();
    expect(report.data!).toHaveProperty("id");

    await client.DELETE("/u/report/item/{id}", {
      params: { path: { id: report.data!.id } },
    });

    const res = await client.GET("/u/report/item/{id}", {
      params: { path: { id: report.data!.id } },
    });

    expect(res).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("without report permission should response FORBIDDEN error", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: [],
    });
    const res = await client.GET("/u/report/item");
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("with a minimal permission should response ok", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenPermissions: ["/REPORT"],
    });
    const res = await client.GET("/u/report/item");
    expect(res).toBeApiOk();
  });

  it("should respond PLAN_DISABLED_OP error without correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: [] },
    });
    const res = await client.GET("/u/report/item");
    expect(res).toBeApiError(EApiFailCode.PLAN_DISABLED_OP);
  });

  it("should work with correct organization plan feature", async () => {
    const { client } = await UtilTest.createClientLoggedIn({
      overwrittenOrganizationPlan: { features: ["REPORT"] },
    });
    const res = await client.GET("/u/report/item");
    expect(res).toBeApiOk();
  });
});
