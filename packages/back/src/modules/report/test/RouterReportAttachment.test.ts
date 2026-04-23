import { EApiFailCode } from "common";
import { describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";

describe("E2E - RouterReportAttachment", () => {
  it("Save attachment", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const reportFile = new File(["DUMMY_PDF_CONTENT"], "report", {
      type: "application/pdf",
    });

    const createRes = await client.POST("/u/report/attachment/upload", {
      body: { file: "", name: "report" },
      bodySerializer() {
        const formData = new FormData();
        formData.append("file", reportFile);
        formData.append("name", "report");
        return formData;
      },
      parseAs: "stream",
    });

    expect(createRes).toBeApiOk();
  });

  it("Get attachments", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const reportFile = new File(["DUMMY_PDF_CONTENT"], "report", {
      type: "application/pdf",
    });

    const createRes = await client.POST("/u/report/attachment/upload", {
      body: { file: "", name: "report" },
      bodySerializer() {
        const formData = new FormData();
        formData.append("file", reportFile);
        formData.append("name", "report");
        return formData;
      },
      parseAs: "stream",
    });

    expect(createRes).toBeApiOk();

    const fileRes = await client.GET("/u/report/attachment/item");

    expect(fileRes).toBeApiOk();
    expect(fileRes.data).toStrictEqual({
      records: [
        {
          id: expect.any(String),
          name: "report",
          createdBy: session.userId,
          createdAt: expect.any(String),
        },
      ],
    });
  });

  it("Get attachment", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const reportFile = new File(["DUMMY_PDF_CONTENT"], "report", {
      type: "application/pdf",
    });

    const createRes = await client.POST("/u/report/attachment/upload", {
      body: { file: "", name: "report" },
      bodySerializer() {
        const formData = new FormData();
        formData.append("file", reportFile);
        formData.append("name", "report");
        return formData;
      },
      parseAs: "stream",
    });

    const res = await client.GET("/u/report/attachment/item");
    const fileId = res.data!.records[0].id;

    expect(createRes).toBeApiOk();

    const fileRes = await client.GET("/u/report/attachment/item/{id}", {
      params: { path: { id: fileId } },
    });

    expect(fileRes).toBeApiOk();
    expect(fileRes.data).toStrictEqual({
      id: expect.any(String),
      name: "report",
      createdBy: session.userId,
      createdAt: expect.any(String),
    });
  });

  it("Remove attachment", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const reportFile = new File(["DUMMY_PDF_CONTENT"], "report", {
      type: "application/pdf",
    });

    const createRes = await client.POST("/u/report/attachment/upload", {
      body: { file: "", name: "report" },
      bodySerializer() {
        const formData = new FormData();
        formData.append("file", reportFile);
        formData.append("name", "report");
        return formData;
      },
      parseAs: "stream",
    });

    expect(createRes).toBeApiOk();
    const res = await client.GET("/u/report/attachment/item");
    const fileId = res.data!.records[0].id;

    await client.DELETE("/u/report/attachment/item/{id}", {
      params: { path: { id: fileId } },
    });
    const fileRes = await client.GET("/u/report/attachment/item/{id}", {
      params: { path: { id: fileId } },
    });

    expect(fileRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("Get report with attachments", async () => {
    vi.spyOn(ServiceMessageQueue, "produce").mockResolvedValue(undefined);

    const { client, session } = await UtilTest.createClientLoggedIn();

    const attachmentFileContent = "DUMMY_CONTENT_FOR_ATTACHMENT";
    const attachmentName = "attachment_test";
    const attachmentFile = new File([attachmentFileContent], attachmentName, {
      type: "application/pdf",
    });

    const uploadRes = await client.POST("/u/report/attachment/upload", {
      body: { file: "", name: attachmentName },
      bodySerializer() {
        const formData = new FormData();
        formData.append("file", attachmentFile);
        formData.append("name", attachmentName);
        return formData;
      },
      parseAs: "stream",
    });

    expect(uploadRes).toBeApiOk();
    const res = await client.GET("/u/report/attachment/item");
    const attachmentId = res.data!.records[0].id;

    const createRes = await client.POST("/u/report/create", {
      params: { query: { tz: "Europe/Istanbul" } },
      body: {
        report: {
          title: {
            type: "PLAIN",
            value: "Report with Attachments",
          },
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          authorIds: [session.userId],
          sections: [],
        },

        attachmentIds: [attachmentId],
      },
      headers: { "accept-language": "en" },
      parseAs: "json",
    });

    expect(createRes).toBeApiOk();

    const reportId = createRes.data!.id;

    // Get by id
    const resItem = await client.GET("/u/report/item/{id}", {
      params: { path: { id: reportId } },
    });
    expect(resItem.data).toStrictEqual({
      id: reportId,
      title: {
        type: "PLAIN",
        value: "Report with Attachments",
      },
      dateStart: "2025-08-01",
      dateEnd: "2025-08-31",
      status: "PENDING",
      attachments: [
        {
          id: attachmentId,
          name: "attachment_test",
        },
      ],
      createdAt: expect.any(String),
      config: {
        authorIds: [session.userId],
        dateEnd: "2025-08-31",
        dateStart: "2025-08-01",
        sections: [],
        title: {
          type: "PLAIN",
          value: "Report with Attachments",
        },
      },
    });

    // Get all
    const resAll = await client.GET("/u/report/item");
    expect(resAll.data).toStrictEqual({
      records: [
        {
          id: reportId,
          dateStart: "2025-08-01",
          dateEnd: "2025-08-31",
          title: {
            type: "PLAIN",
            value: "Report with Attachments",
          },
          createdAt: expect.any(String),
          status: "PENDING",
          attachments: [
            {
              id: attachmentId,
              name: "attachment_test",
            },
          ],
        },
      ],
    });
  });
});
