import { EApiFailCode } from "common";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterMetricFileDraft", () => {
  const filePath = path.resolve(__dirname, "files", "example_metric_data.xlsx");

  it("should upload excel file", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Upload Metric",
        description: "Testing draft upload",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });

    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    const uploadRes = await client.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: buf as unknown as string,
          tz: "Europe/Istanbul",
        },
        bodySerializer(body) {
          const fd = new FormData();
          fd.append(
            "file",
            new File([body.file], "example_metric_data.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          );
          fd.append("tz", String(body.tz));
          return fd;
        },
      },
    );

    expect(uploadRes).toBeApiOk();
  });

  it("should get draft contents", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Get Metric",
        description: "Testing draft get",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    const uploadRes = await client.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: buf as unknown as string,
          tz: "Etc/GMT",
        },
        bodySerializer(body) {
          const fd = new FormData();
          fd.append(
            "file",
            new File([body.file], "example_metric_data.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          );
          fd.append("tz", String(body.tz));
          return fd;
        },
      },
    );

    expect(uploadRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/metric/file-draft/item");

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      records: [
        {
          content: [
            {
              datetime: "2025-05-14T12:20:10.000Z",
              value: 10,
              labels: [
                {
                  key: "location",
                  type: "USER_DEFINED",
                  value: "factory a",
                },
              ],
            },
            {
              datetime: "2025-05-15T12:20:10.000Z",
              value: 10.75,
              labels: [
                {
                  key: "location",
                  type: "USER_DEFINED",
                  value: "factory a",
                },
              ],
            },
            {
              datetime: "2025-05-16T12:20:10.000Z",
              value: 11.5,
              labels: [
                {
                  key: "location",
                  type: "USER_DEFINED",
                  value: "factory b",
                },
              ],
            },
            {
              datetime: "2025-05-17T12:20:10.000Z",
              value: 12.25,
              labels: [
                {
                  key: "location",
                  type: "USER_DEFINED",
                  value: "factory a",
                },
              ],
            },
            {
              datetime: "2025-05-18T12:20:10.000Z",
              value: 13,
              labels: [],
            },
          ],
          metric: {
            id: metricId,
            name: "Draft Get Metric",
            type: "GAUGE",
            unitGroup: "ENERGY",
          },
          createdAt: expect.any(String),
          createdBy: session.userId,
        },
      ],
    });
  });

  it("should get draft content", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Get Metric",
        description: "Testing draft get",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    const uploadRes = await client.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: buf as unknown as string,
          tz: "Etc/GMT",
        },
        bodySerializer(body) {
          const fd = new FormData();
          fd.append(
            "file",
            new File([body.file], "example_metric_data.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          );
          fd.append("tz", String(body.tz));
          return fd;
        },
      },
    );
    expect(uploadRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/measurement/metric/file-draft/item/{id}",
      {
        params: { path: { id: metricId } },
      },
    );

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      createdAt: expect.any(String),
      createdBy: session.userId,
      content: [
        {
          datetime: "2025-05-14T12:20:10.000Z",
          value: 10,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-15T12:20:10.000Z",
          value: 10.75,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-16T12:20:10.000Z",
          value: 11.5,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory b",
            },
          ],
        },
        {
          datetime: "2025-05-17T12:20:10.000Z",
          value: 12.25,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-18T12:20:10.000Z",
          value: 13,
          labels: [],
        },
      ],
    });
  });

  it("should overwrite draft content on re-upload", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Overwrite Metric",
        description: "Testing draft overwrite",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    await client.PUT("/u/measurement/metric/file-draft/item/{id}/upload", {
      params: { path: { id: metricId } },
      body: {
        file: buf as unknown as string,
        tz: "Etc/GMT",
      },
      bodySerializer(body) {
        const fd = new FormData();
        fd.append(
          "file",
          new File([body.file], "example_metric_data.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
        fd.append("tz", String(body.tz));
        return fd;
      },
    });

    await client.PUT("/u/measurement/metric/file-draft/item/{id}/upload", {
      params: { path: { id: metricId } },
      body: {
        file: buf as unknown as string,
        tz: "Europe/Istanbul",
      },
      bodySerializer(body) {
        const fd = new FormData();
        fd.append(
          "file",
          new File([body.file], "example_metric_data.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
        fd.append("tz", String(body.tz));
        return fd;
      },
    });

    const getRes = await client.GET(
      "/u/measurement/metric/file-draft/item/{id}",
      {
        params: { path: { id: metricId } },
      },
    );

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      createdAt: expect.any(String),
      createdBy: session.userId,
      content: [
        {
          datetime: "2025-05-14T09:20:10.000Z",
          value: 10,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-15T09:20:10.000Z",
          value: 10.75,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-16T09:20:10.000Z",
          value: 11.5,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory b",
            },
          ],
        },
        {
          datetime: "2025-05-17T09:20:10.000Z",
          value: 12.25,
          labels: [
            {
              key: "location",
              type: "USER_DEFINED",
              value: "factory a",
            },
          ],
        },
        {
          datetime: "2025-05-18T09:20:10.000Z",
          value: 13,
          labels: [],
        },
      ],
    });
  });

  it("should save draft to metric values", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Save Metric",
        description: "Testing draft save",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    await client.PUT("/u/measurement/metric/file-draft/item/{id}/upload", {
      params: { path: { id: metricId } },
      body: {
        file: buf as unknown as string,
        tz: "Etc/GMT",
      },
      bodySerializer(body) {
        const fd = new FormData();
        fd.append(
          "file",
          new File([body.file], "example_metric_data.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
        fd.append("tz", String(body.tz));
        return fd;
      },
    });

    const saveRes = await client.POST(
      "/u/measurement/metric/file-draft/item/{id}/save",
      {
        params: { path: { id: metricId } },
        body: { unit: "ENERGY_KWH" },
      },
    );

    expect(saveRes).toBeApiOk();

    const resourceId = saveRes.data!.resourceIds[0];

    const getValuesRes = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            count: 10,
            page: 1,
            period: "RAW",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );

    expect(getValuesRes).toBeApiOk();
    expect(getValuesRes.data).toStrictEqual({
      recordCount: 3,
      records: [
        { datetime: "2025-05-14T12:20:10.000Z", value: 10, sampleCount: 1 },
        { datetime: "2025-05-15T12:20:10.000Z", value: 10.75, sampleCount: 1 },
        { datetime: "2025-05-17T12:20:10.000Z", value: 12.25, sampleCount: 1 },
      ],
    });
  });

  it("should cancel draft", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft Cancel Metric",
        description: "Testing draft cancel",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    await client.PUT("/u/measurement/metric/file-draft/item/{id}/upload", {
      params: { path: { id: metricId } },
      body: {
        file: buf as unknown as string,
        tz: "Etc/GMT",
      },
      bodySerializer(body) {
        const fd = new FormData();
        fd.append(
          "file",
          new File([body.file], "example_metric_data.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
        );
        fd.append("tz", String(body.tz));
        return fd;
      },
    });

    const cancelRes = await client.POST(
      "/u/measurement/metric/file-draft/item/{id}/cancel",
      {
        params: { path: { id: metricId } },
      },
    );

    expect(cancelRes).toBeApiOk();

    const getRes = await client.GET(
      "/u/measurement/metric/file-draft/item/{id}",
      {
        params: { path: { id: metricId } },
      },
    );

    expect(getRes).toBeApiError(EApiFailCode.NOT_FOUND);
  });

  it("should parse labels from excel and save them with internal source label", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Label Test Metric",
        description: "Testing label parsing and saving",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });

    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    const uploadRes = await client.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: buf as unknown as string,
          tz: "Etc/GMT",
        },
        bodySerializer(body) {
          const fd = new FormData();
          fd.append(
            "file",
            new File([body.file], "example_metric_data.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          );
          fd.append("tz", String(body.tz));
          return fd;
        },
      },
    );
    expect(uploadRes).toBeApiOk();

    const getDraftRes = await client.GET(
      "/u/measurement/metric/file-draft/item/{id}",
      {
        params: { path: { id: metricId } },
      },
    );

    expect(getDraftRes).toBeApiOk();
    expect(getDraftRes.data!.content[0].labels).toStrictEqual([
      {
        type: "USER_DEFINED",
        key: "location",
        value: "factory a",
      },
    ]);

    const saveRes = await client.POST(
      "/u/measurement/metric/file-draft/item/{id}/save",
      {
        params: { path: { id: metricId } },
        body: { unit: "ENERGY_KWH" },
      },
    );
    expect(saveRes).toBeApiOk();
    const resourceIds = saveRes.data!.resourceIds;

    const resourceRes = await client.GET("/u/measurement/metric/resources", {
      query: {
        resourceIds,
      },
    });

    expect(resourceRes).toBeApiOk();
    expect(resourceRes.data?.records).toStrictEqual([
      {
        id: expect.any(String),
        labels: [
          {
            key: "SOURCE",
            type: "INTERNAL",
            value: "EXCEL",
          },
          {
            key: "location",
            type: "USER_DEFINED",
            value: "factory a",
          },
        ],
        metric: {
          id: expect.any(String),
          name: "Label Test Metric",
          type: "GAUGE",
          unitGroup: "ENERGY",
        },
      },
      {
        id: expect.any(String),
        labels: [
          {
            key: "SOURCE",
            type: "INTERNAL",
            value: "EXCEL",
          },
        ],
        metric: {
          id: expect.any(String),
          name: "Label Test Metric",
          type: "GAUGE",
          unitGroup: "ENERGY",
        },
      },
      {
        id: expect.any(String),
        labels: [
          {
            key: "SOURCE",
            type: "INTERNAL",
            value: "EXCEL",
          },
          {
            key: "location",
            type: "USER_DEFINED",
            value: "factory b",
          },
        ],
        metric: {
          id: expect.any(String),
          name: "Label Test Metric",
          type: "GAUGE",
          unitGroup: "ENERGY",
        },
      },
    ]);
  });

  it("should save draft with specific timezone adjustment", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Draft TZ Metric",
        description: "Testing draft timezone",
        unitGroup: "ENERGY",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const buf = await readFile(filePath);

    const uploadRes = await client.PUT(
      "/u/measurement/metric/file-draft/item/{id}/upload",
      {
        params: { path: { id: metricId } },
        body: {
          file: buf as unknown as string,
          tz: "Europe/Istanbul",
        },
        bodySerializer(body) {
          const fd = new FormData();
          fd.append(
            "file",
            new File([body.file], "example_metric_data.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          );
          fd.append("tz", String(body.tz));
          return fd;
        },
      },
    );
    expect(uploadRes).toBeApiOk();

    const saveRes = await client.POST(
      "/u/measurement/metric/file-draft/item/{id}/save",
      {
        params: { path: { id: metricId } },
        body: { unit: "ENERGY_KWH" },
      },
    );

    expect(saveRes).toBeApiOk();
    const resourceId = saveRes.data!.resourceIds[0];

    const getValuesRes = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            count: 10,
            page: 1,
            period: "RAW",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );

    expect(getValuesRes).toBeApiOk();
    expect(getValuesRes.data?.records).toStrictEqual([
      { datetime: "2025-05-14T09:20:10.000Z", value: 10, sampleCount: 1 },
      { datetime: "2025-05-15T09:20:10.000Z", value: 10.75, sampleCount: 1 },
      { datetime: "2025-05-17T09:20:10.000Z", value: 12.25, sampleCount: 1 },
    ]);
  });
});
