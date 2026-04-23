import { EApiFailCode, UtilDate } from "common";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceMetric } from "../services/ServiceMetric";
import { ServiceOutboundIntegration } from "../services/ServiceOutboundIntegration";
import { TestHelperMetric } from "./TestHelperMetric";
import { TestHelperOutboundIntegration } from "./TestHelperOutboundIntegration";

describe("E2E - RouterMeasurementMetric", () => {
  it("should add values through API and auto-append SOURCE label", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "API Push Metric",
        description: "Testing API value insertion",
        unitGroup: "POWER",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const datetime = "2025-10-10T10:00:00.000Z";

    const rec = await client.POST("/u/measurement/metric/item/{id}/values", {
      params: { path: { id: metricId } },
      body: {
        unit: "POWER_KW",
        values: [{ datetime, value: 42.5 }],
        labels: [{ key: "environment", value: "production" }],
      },
    });

    expect(rec).toBeApiOk();
    const id = rec.data!.resourceId;
    expect(id).toBeDefined();

    const resourceRes = await client.GET("/u/measurement/metric/resources", {
      params: { query: { metricId } },
    });
    expect(resourceRes).toBeApiOk();

    expect(resourceRes.data).toStrictEqual({
      records: [
        {
          id: expect.any(String),
          labels: [
            {
              key: "SOURCE",
              type: "INTERNAL",
              value: "API",
            },
            {
              key: "environment",
              type: "USER_DEFINED",
              value: "production",
            },
          ],
          metric: {
            id: metricId,
            name: "API Push Metric",
            type: "GAUGE",
            unitGroup: "POWER",
          },
        },
      ],
    });

    const res = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId: id },
          query: {
            period: "RAW",
            datetimeMin: "2025-10-10T09:00:00.000Z",
            datetimeMax: "2025-10-10T11:00:00.000Z",
          },
        },
      },
    );
    expect(res).toBeApiOk();

    expect(res.data).toStrictEqual({
      recordCount: 1,
      records: [
        {
          datetime,
          sampleCount: 1,
          value: 42.5,
        },
      ],
    });
  });

  it("should be correct metric values", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const resourceId = await TestHelperMetric.addValues(
      session.orgId,
      createdId,
      [
        { value: 10, datetime: "2025-06-08T11:01:02.003Z" },
        { value: 20, datetime: "2025-06-08T12:01:02.003Z" },
        { value: 30, datetime: "2025-06-08T13:01:02.003Z" },
        { value: 40, datetime: "2025-06-08T14:01:02.003Z" },
        { value: 50, datetime: "2025-06-08T15:01:02.003Z" },
      ],
    );

    const getRes = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            count: 5,
            page: 1,
            period: "HOURLY",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      recordCount: 5,
      records: [
        { value: 10, datetime: "2025-06-08T11:00:00.000Z", sampleCount: 1 },
        { value: 20, datetime: "2025-06-08T12:00:00.000Z", sampleCount: 1 },
        { value: 30, datetime: "2025-06-08T13:00:00.000Z", sampleCount: 1 },
        { value: 40, datetime: "2025-06-08T14:00:00.000Z", sampleCount: 1 },
        { value: 50, datetime: "2025-06-08T15:00:00.000Z", sampleCount: 1 },
      ],
    });
  });

  it("should be correct graph metric values", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    await TestHelperMetric.addValues(session.orgId, createdId, [
      { value: 10, datetime: "2025-06-08T11:01:02.003Z" },
      { value: 20, datetime: "2025-06-08T12:01:02.003Z" },
      { value: 30, datetime: "2025-06-08T13:01:02.003Z" },
      { value: 40, datetime: "2025-06-08T14:01:02.003Z" },
      { value: 50, datetime: "2025-06-08T15:01:02.003Z" },
    ]);

    const getRes = await client.GET("/u/measurement/metric/item/{id}/graph", {
      params: {
        path: { id: createdId },
        query: {
          datetimeMin: "2025-06-08T11:00:00.000Z",
          datetimeMax: "2025-06-08T14:01:00.000Z",
        },
      },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      period: "MINUTELY",
      values: [
        {
          value: 10,
          datetime: "2025-06-08T11:01:00.000Z",
        },
        {
          value: 20,
          datetime: "2025-06-08T12:01:00.000Z",
        },
        {
          value: 30,
          datetime: "2025-06-08T13:01:00.000Z",
        },
        {
          value: 40,
          datetime: "2025-06-08T14:01:00.000Z",
        },
      ],
    });
  });

  it("should be correct low resolution graph metric values", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    await TestHelperMetric.addValues(session.orgId, createdId, [
      { value: 10, datetime: "2025-06-08T11:01:02.003Z" },
      { value: 20, datetime: "2025-06-08T12:01:02.003Z" },
      { value: 30, datetime: "2025-06-08T13:01:02.003Z" },
      { value: 40, datetime: "2025-06-08T14:01:02.003Z" },
      { value: 50, datetime: "2025-06-08T15:01:02.003Z" },
    ]);

    const getRes = await client.GET("/u/measurement/metric/item/{id}/graph", {
      params: {
        path: { id: createdId },
        query: {
          datetimeMin: "2025-06-06T11:00:00.000Z",
          datetimeMax: "2025-06-11T14:00:00.000Z",
        },
      },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      period: "HOURLY",
      values: [
        { value: 10, datetime: "2025-06-08T11:00:00.000Z" },
        { value: 20, datetime: "2025-06-08T12:00:00.000Z" },
        { value: 30, datetime: "2025-06-08T13:00:00.000Z" },
        { value: 40, datetime: "2025-06-08T14:00:00.000Z" },
        { value: 50, datetime: "2025-06-08T15:00:00.000Z" },
      ],
    });

    const getResLow = await client.GET(
      "/u/measurement/metric/item/{id}/graph",
      {
        params: {
          path: { id: createdId },
          query: {
            datetimeMin: "2025-06-06T11:00:00.000Z",
            datetimeMax: "2025-06-13T14:00:00.000Z",
            lowResolutionMode: "true",
          },
        },
      },
    );

    expect(getResLow).toBeApiOk();
    expect(getResLow.data).toStrictEqual({
      period: "DAILY",
      values: [
        {
          value: 30, // 150 / 5
          datetime: "2025-06-08T00:00:00.000Z",
        },
      ],
    });
  });

  it("should be correct metric values when deleted some metric values", async () => {
    const context = await UtilTest.createTestContextUser();

    const { client } = await UtilTest.createClientLoggedIn();
    const dateToday = UtilDate.objToIsoDatetime(new Date());
    const dateYesterdayObj = new Date();
    dateYesterdayObj.setUTCDate(dateYesterdayObj.getUTCDate() - 1);
    const dateYesterday = UtilDate.objToIsoDatetime(dateYesterdayObj);

    const metricId = await ServiceMetric.create(context, {
      name: "metric name",
      description: "metric description",
      unitGroup: "ENERGY",
      type: "GAUGE",
    });

    const { integrationId, config } =
      await TestHelperOutboundIntegration.create(context, {
        metricId,
        period: "HOURLY",
        results: [
          { outputKey: "default", data: { value: 10, datetime: dateToday } },
          {
            outputKey: "default",
            data: { value: 20, datetime: dateYesterday },
          },
        ],
      });

    const outputs = await ServiceOutboundIntegration.getOutputs(
      context,
      context.session.orgId,
      integrationId,
    );

    const results = await ServiceOutboundIntegration.run(context, config);

    const [resourcePair] = await ServiceOutboundIntegration.saveValues(
      context,
      context.session.orgId,
      integrationId,
      outputs,
      results,
      config.type,
    );

    const values = await ServiceMetric.getValues(
      context,
      "RESOURCE",
      resourcePair.resourceId,
      {
        ...TestHelperMetric.getFullDatetimeRangeQuery(),
        count: 2,
        page: 1,
        period: "RAW",
      },
    );

    expect(values).toStrictEqual({
      recordCount: 2,
      records: [
        { value: 20, datetime: dateYesterday, sampleCount: 1 },
        { value: 10, datetime: dateToday, sampleCount: 1 },
      ],
    });

    const deleteRequest = await client.DELETE(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: { path: { resourceId: resourcePair.resourceId } },
        body: {
          datetimes: [dateYesterday],
        },
      },
    );

    expect(deleteRequest).toBeApiOk();

    const deletedRes = await ServiceMetric.getValues(
      context,
      "RESOURCE",
      resourcePair.resourceId,
      {
        ...TestHelperMetric.getFullDatetimeRangeQuery(),
        count: 2,
        page: 1,
        period: "RAW",
      },
    );

    expect(deletedRes).toStrictEqual({
      recordCount: 1,
      records: [{ value: 10, datetime: dateToday, sampleCount: 1 }],
    });
  });

  it("Create metric", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const res = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "test metric ",
        description: "test metric  desc",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(res).toBeApiOk();
  });

  it("Get metric", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const payload = {
      name: "test metric ",
      description: "test metric  desc",
      unitGroup: "TIME",
      type: "GAUGE",
    } as const;

    const createResponse = await client.POST("/u/measurement/metric/item", {
      body: payload,
    });

    const createdId = createResponse.data!.id;

    const res = await client.GET("/u/measurement/metric/item");

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          org: {
            id: session.orgId,
            displayName: "Example Org.",
          },
          ...payload,
          type: "GAUGE",
          outboundIntegration: null,
          inboundIntegration: null,
          lastValue: null,
          lastValueDatetime: null,
          valuesUpdatedAt: null,
        },
      ],
    });
  });

  it("Update metric", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "test metric ",
        description: "test metric  desc",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const updateBody = {
      name: "test metric ",
      description: "test metric  desc",
      unitGroup: "TIME",
      type: "GAUGE",
    } as const;

    const updateRes = await client.PUT("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
      body: updateBody,
    });

    expect(updateRes).toBeApiOk();

    const getRes = await client.GET("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes.data).toStrictEqual({
      id: createdId,
      outboundIntegration: null,
      inboundIntegration: null,
      ...updateBody,
      lastValue: null,
      lastValueDatetime: null,
      valuesUpdatedAt: null,
    });
  });

  it("Delete metric", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const res = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "elektronic name5",
        description: "text5",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });

    expect(res).toBeApiOk();
    const createdId = res.data!.id;
    expect(createdId).toBeDefined();

    const deleteRes = await client.DELETE("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(deleteRes).toBeApiOk();
  });

  it("Get metric by id", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "metric",
        description: "text",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const getRes = await client.GET("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
    });

    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: "metric",
      description: "text",
      unitGroup: "TIME",
      type: "GAUGE",
      outboundIntegration: null,
      inboundIntegration: null,
      lastValue: null,
      lastValueDatetime: null,
      valuesUpdatedAt: null,
    });
  });

  it("should be correct metric name", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      name: "test metric",
      description: "test metric  desc",
      unitGroup: "TIME",
      type: "GAUGE",
    } as const;

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: { ...payload },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const res = await client.GET("/u/measurement/metric/names");

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          name: payload.name,
          type: "GAUGE",
          unitGroup: "TIME",
        },
      ],
    });
  });

  it("should search metric name", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes1 = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "test metric",
        description: "test metric  desc",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes1).toBeApiOk();
    const createRes2 = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "OTHER metric",
        description: "test metric  desc",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes2).toBeApiOk();
    const createRes3 = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "another metric",
        description: "test metric  desc",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes3).toBeApiOk();

    const res = await client.GET("/u/measurement/metric/names", {
      params: { query: { search: "other" } },
    });

    expect(res).toBeApiOk();
    expect(res.data!.records.length).toBe(2);
    expect(res.data!.records).toContainEqual({
      id: createRes2.data!.id,
      name: "OTHER metric",
      type: "GAUGE",
      unitGroup: "TIME",
    });
    expect(res.data!.records).toContainEqual({
      id: createRes3.data!.id,
      name: "another metric",
      type: "GAUGE",
      unitGroup: "TIME",
    });
  });

  it("should be return correct integration name", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const payload = {
      name: "test metric ",
      description: "test metric  desc",
      unitGroup: "VOLTAGE",
      type: "GAUGE",
    } as const;

    const res = await client.POST("/u/measurement/metric/item", {
      body: payload,
    });

    expect(res).toBeApiOk();

    const createdId = res.data!.id;

    const resIntegration = await client.POST(
      "/u/measurement/outbound-integration/item",
      {
        body: {
          name: "Outbound Integration",
          config: {
            type: "MOCK_SOURCE",
            period: "HOURLY",
            param: { waves: [] },
          },
          outputs: [
            {
              outputKey: "default",
              metricId: createdId,
              unit: "VOLTAGE",
            },
          ],
        },
      },
    );
    expect(resIntegration).toBeApiOk();
    const integrationId = resIntegration.data!.id;

    const getRes = await client.GET("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(getRes).toBeApiOk();

    expect(getRes.data).toStrictEqual({
      id: createdId,
      name: payload.name,
      description: payload.description,
      unitGroup: payload.unitGroup,
      type: "GAUGE",
      outboundIntegration: {
        id: integrationId,
        period: "HOURLY",
        type: "MOCK_SOURCE",
      },
      inboundIntegration: null,
      lastValue: null,
      lastValueDatetime: null,
      valuesUpdatedAt: null,
    });
  });

  it("Overwrite old values", async () => {
    const { client } = await UtilTest.createClientLoggedIn();
    const c = await UtilTest.createTestContextUser();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "TimeCheckMetric",
        description: "Testing time validation",
        unitGroup: "POWER",
        type: "GAUGE",
      },
    });

    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const labels = TestHelperMetric.getTestResourceLabels();

    // Reference value
    const resourceId = await ServiceMetric.addValues(
      c,
      c.session.orgId,
      metricId,
      "POWER_KW",
      [{ value: 20, datetime: "2025-08-14T12:00:00.000Z" }],
      labels,
    );

    // Check old data
    const resRef = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            datetimeMin: "2025-08-13T11:00:00.000Z",
            datetimeMax: "2025-08-15T11:00:00.000Z",
            period: "HOURLY",
          },
        },
      },
    );
    expect(resRef).toBeApiOk();
    expect(resRef.data).toStrictEqual({
      recordCount: 1,
      records: [
        {
          datetime: "2025-08-14T12:00:00.000Z",
          sampleCount: 1,
          value: 20,
        },
      ],
    });

    // Older datetime value
    await ServiceMetric.addValues(
      c,
      c.session.orgId,
      metricId,
      "POWER_KW",
      [
        { value: 15, datetime: "2025-08-14T11:00:00.000Z" },
        { value: 10, datetime: "2025-08-14T12:00:00.000Z" },
      ],
      labels,
    );

    const res = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            datetimeMin: "2025-08-13T11:00:00.000Z",
            datetimeMax: "2025-08-15T11:00:00.000Z",
            period: "HOURLY",
          },
        },
      },
    );

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      recordCount: 2,
      records: [
        {
          datetime: "2025-08-14T11:00:00.000Z",
          sampleCount: 1,
          value: 15,
        },
        {
          datetime: "2025-08-14T12:00:00.000Z",
          sampleCount: 1,
          value: 10,
        },
      ],
    });
  });

  it("metric record should contain info about latest added values", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "POWER",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;

    const c = await UtilTest.createTestContextUser();

    await ServiceMetric.addValues(
      c,
      c.session.orgId,
      createdId,
      "POWER_KW",
      [
        {
          value: 10,
          datetime: "2025-08-14T10:11:12.000Z",
        },
        {
          value: 20,
          datetime: "2025-08-14T11:11:12.000Z",
        },
      ],
      TestHelperMetric.getTestResourceLabels(),
    );

    const res = await client.GET("/u/measurement/metric/item");

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      records: [
        {
          id: createdId,
          org: {
            id: session.orgId,
            displayName: "Example Org.",
          },
          name: "MetricName",
          description: "Metric Description",
          unitGroup: "POWER",
          type: "GAUGE",
          outboundIntegration: null,
          inboundIntegration: null,
          lastValue: 20,
          lastValueDatetime: "2025-08-14T11:11:12.000Z",
          valuesUpdatedAt: c.nowDatetime,
        },
      ],
    });
  });

  it("delta values should be calculated properly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "ENERGY",
        type: "COUNTER",
      },
    });

    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;

    const c = await UtilTest.createTestContextUser();

    const resourceId = await ServiceMetric.addValues(
      c,
      c.session.orgId,
      createdId,
      "ENERGY_KWH",
      [
        { value: 10, datetime: "2025-08-14T10:00:00.000Z" },
        { value: 20, datetime: "2025-08-14T10:01:00.000Z" },
        { value: 45, datetime: "2025-08-14T10:02:00.000Z" },
        { value: 10, datetime: "2025-08-14T10:03:00.000Z" },
      ],
      TestHelperMetric.getTestResourceLabels(),
    );

    // Raw values
    const resValuesRaw = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            period: "RAW",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );
    expect(resValuesRaw).toBeApiOk();
    expect(resValuesRaw.data).toStrictEqual({
      recordCount: 4,
      records: [
        { datetime: "2025-08-14T10:00:00.000Z", value: 10, sampleCount: 1 },
        { datetime: "2025-08-14T10:01:00.000Z", value: 20, sampleCount: 1 },
        { datetime: "2025-08-14T10:02:00.000Z", value: 45, sampleCount: 1 },
        { datetime: "2025-08-14T10:03:00.000Z", value: 10, sampleCount: 1 },
      ],
    });

    const resValues = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            period: "MINUTELY",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );
    expect(resValues).toBeApiOk();
    expect(resValues.data).toStrictEqual({
      recordCount: 3,
      records: [
        // First delta is skipped
        { datetime: "2025-08-14T10:01:00.000Z", value: 10, sampleCount: 1 },
        { datetime: "2025-08-14T10:02:00.000Z", value: 25, sampleCount: 1 },
        // Rollover delta
        { datetime: "2025-08-14T10:03:00.000Z", value: 0, sampleCount: 1 },
      ],
    });

    const resMetric = await client.GET("/u/measurement/metric/item/{id}", {
      params: { path: { id: createdId } },
    });
    expect(resMetric).toBeApiOk();
    expect(resMetric.data).toStrictEqual({
      id: createdId,
      name: "MetricName",
      description: "Metric Description",
      unitGroup: "ENERGY",
      type: "COUNTER",
      outboundIntegration: null,
      inboundIntegration: null,
      lastValue: 10,
      lastValueDatetime: "2025-08-14T10:03:00.000Z",
      valuesUpdatedAt: c.nowDatetime,
    });
  });

  it("should be change record count after filter", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "TIME",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const createdId = createRes.data!.id;
    expect(createdId).toBeDefined();

    const resourceId = await TestHelperMetric.addValues(
      session.orgId,
      createdId,
      [
        { value: 10, datetime: "2025-06-08T11:01:02.003Z" },
        { value: 20, datetime: "2025-06-08T12:01:02.003Z" },
        { value: 30, datetime: "2025-06-08T13:01:02.003Z" },
        { value: 40, datetime: "2025-06-08T14:01:02.003Z" },
        { value: 50, datetime: "2025-06-08T15:01:02.003Z" },
      ],
    );

    const getRes = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            count: 5,
            page: 1,
            period: "HOURLY",
            ...TestHelperMetric.getFullDatetimeRangeQuery(),
          },
        },
      },
    );

    expect(getRes.data?.recordCount).toEqual(5);

    const getRes2 = await client.GET(
      "/u/measurement/metric/resource/{resourceId}/values",
      {
        params: {
          path: { resourceId },
          query: {
            count: 5,
            page: 1,
            period: "HOURLY",
            datetimeMin: "2025-06-08T11:00:00.000Z",
            datetimeMax: "2025-06-08T13:00:00.000Z",
          },
        },
      },
    );

    expect(getRes2).toBeApiOk();
    expect(getRes2.data).toStrictEqual({
      recordCount: 3,
      records: [
        { value: 10, datetime: "2025-06-08T11:00:00.000Z", sampleCount: 1 },
        { value: 20, datetime: "2025-06-08T12:00:00.000Z", sampleCount: 1 },
        { value: 30, datetime: "2025-06-08T13:00:00.000Z", sampleCount: 1 },
      ],
    });
  });

  it("should return resources correctly", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const context = await UtilTest.createTestContextUser();

    const metric1 = await TestHelperMetric.create(client, "Metric 1");
    const metric2 = await TestHelperMetric.create(client, "Metric 2");

    const resourceId1 = await ServiceMetric.findOrCreateResource(
      context,
      context.orgId,
      metric1.id,
      [
        { type: "USER_DEFINED", key: "r1_key1", value: "value1" },
        { type: "USER_DEFINED", key: "r1_key2", value: "value2" },
      ],
    );
    const resourceId2 = await ServiceMetric.findOrCreateResource(
      context,
      context.orgId,
      metric1.id,
      [
        { type: "USER_DEFINED", key: "r2_key1", value: "value1" },
        { type: "USER_DEFINED", key: "r2_key2", value: "value2" },
      ],
    );
    const resourceId3 = await ServiceMetric.findOrCreateResource(
      context,
      context.orgId,
      metric2.id,
      [
        { type: "USER_DEFINED", key: "r3_key1", value: "value1" },
        { type: "USER_DEFINED", key: "r3_key2", value: "value2" },
      ],
    );
    const resourceId4 = await ServiceMetric.findOrCreateResource(
      context,
      context.orgId,
      metric2.id,
      [
        { type: "USER_DEFINED", key: "r3_key1", value: "value1" },
        { type: "USER_DEFINED", key: "r3_key2", value: "value2" },
      ],
    );

    expect(resourceId3).toBe(resourceId4);

    // Get only metric 1
    const getRes = await client.GET("/u/measurement/metric/resources", {
      params: { query: { metricId: metric1.id } },
    });
    expect(getRes).toBeApiOk();
    expect(getRes.data).toStrictEqual({
      records: [
        {
          id: resourceId2,
          metric: {
            id: metric1.id,
            name: "Metric 1",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r2_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r2_key2", value: "value2" },
          ],
        },
        {
          id: resourceId1,
          metric: {
            id: metric1.id,
            name: "Metric 1",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r1_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r1_key2", value: "value2" },
          ],
        },
      ],
    });

    // Get only metric 2
    const getRes2 = await client.GET("/u/measurement/metric/resources", {
      params: { query: { metricId: metric2.id } },
    });
    expect(getRes2).toBeApiOk();
    expect(getRes2.data).toStrictEqual({
      records: [
        {
          id: resourceId3,
          metric: {
            id: metric2.id,
            name: "Metric 2",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r3_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r3_key2", value: "value2" },
          ],
        },
      ],
    });

    // Get all metrics
    const getResAll = await client.GET("/u/measurement/metric/resources");
    expect(getResAll).toBeApiOk();
    expect(getResAll.data).toStrictEqual({
      records: [
        {
          id: resourceId2,
          metric: {
            id: metric1.id,
            name: "Metric 1",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r2_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r2_key2", value: "value2" },
          ],
        },
        {
          id: resourceId1,
          metric: {
            id: metric1.id,
            name: "Metric 1",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r1_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r1_key2", value: "value2" },
          ],
        },
        {
          id: resourceId3,
          metric: {
            id: metric2.id,
            name: "Metric 2",
            unitGroup: "TEMPERATURE",
            type: "GAUGE",
          },
          labels: [
            { type: "USER_DEFINED", key: "r3_key1", value: "value1" },
            { type: "USER_DEFINED", key: "r3_key2", value: "value2" },
          ],
        },
      ],
    });
  });

  it("should not let same key for the same resource", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const context = await UtilTest.createTestContextUser();

    const metric1 = await TestHelperMetric.create(client, "Metric 1");

    await expect(
      ServiceMetric.findOrCreateResource(context, context.orgId, metric1.id, [
        { type: "USER_DEFINED", key: "key1", value: "value1" },
        { type: "USER_DEFINED", key: "key1", value: "value2" },
      ]),
    ).rejects.toThrow(EApiFailCode.BAD_REQUEST);
  });

  it("should return labels correctly for a specific metric through API only", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Label Test Metric",
        description: "Testing labels endpoint",
        unitGroup: "TEMPERATURE",
        type: "GAUGE",
      },
    });

    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const addValuesRes = await client.POST(
      "/u/measurement/metric/item/{id}/values",
      {
        params: { path: { id: metricId } },
        body: {
          unit: "TEMPERATURE_CELSIUS",
          values: [{ datetime: "2025-10-10T10:00:00.000Z", value: 25.5 }],
          labels: [
            { key: "location", value: "sensor-alpha" },
            { key: "floor", value: "ground-floor" },
          ],
        },
      },
    );
    expect(addValuesRes).toBeApiOk();

    const labelRes = await client.GET("/u/measurement/metric/labels", {
      params: {
        query: { metricId },
      },
    });

    expect(labelRes).toBeApiOk();

    expect(labelRes.data).toStrictEqual({
      labels: [
        {
          key: "SOURCE",
          type: "INTERNAL",
          value: "API",
        },
        {
          key: "floor",
          type: "USER_DEFINED",
          value: "ground-floor",
        },
        {
          key: "location",
          type: "USER_DEFINED",
          value: "sensor-alpha",
        },
      ],
    });
  });

  it("should return labels", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "Empty Metric",
        description: "Empty Metric Description",
        unitGroup: "TEMPERATURE",
        type: "GAUGE",
      },
    });
    const metricId = createRes.data!.id;

    await client.POST("/u/measurement/metric/item/{id}/values", {
      params: { path: { id: metricId } },
      body: {
        unit: "TEMPERATURE_CELSIUS",
        values: [{ datetime: "2025-10-10T10:00:00.000Z", value: 25.5 }],
        labels: [
          { key: "location", value: "sensor-alpha" },
          { key: "floor", value: "ground-floor" },
        ],
      },
    });

    const res = await client.GET("/u/measurement/metric/labels");

    expect(res).toBeApiOk();
    expect(res.data).toStrictEqual({
      labels: [
        {
          key: "SOURCE",
          type: "INTERNAL",
          value: "API",
        },
        {
          key: "floor",
          type: "USER_DEFINED",
          value: "ground-floor",
        },
        {
          key: "location",
          type: "USER_DEFINED",
          value: "sensor-alpha",
        },
      ],
    });
  });

  it("throw error for unmatched unit group and metric type", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const createRes = await client.POST("/u/measurement/metric/item", {
      body: {
        name: "MetricName",
        description: "Metric Description",
        unitGroup: "POWER",
        type: "COUNTER",
      },
    });
    expect(createRes).toBeApiError(EApiFailCode.BAD_REQUEST);
  });

  it("should share metric with a partner and list shared partners/metrics", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });
    const partner = await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });
    expect(partner).toBeApiOk();

    const createRes = await org1.client.POST("/u/measurement/metric/item", {
      body: {
        name: "Shared Metric",
        description: "This metric will be shared",
        unitGroup: "POWER",
        type: "GAUGE",
      },
    });
    expect(createRes).toBeApiOk();
    const metricId = createRes.data!.id;

    const shareRes = await org1.client.PUT("/u/measurement/metric/share/{id}", {
      params: { path: { id: metricId } },
      body: { partnerIds: [org2.session.orgId] },
    });
    expect(shareRes).toBeApiOk();

    const sharedPartnersRes = await org1.client.GET(
      "/u/measurement/metric/shared-partners/{id}",
      { params: { path: { id: metricId } } },
    );
    expect(sharedPartnersRes).toBeApiOk();
    expect(sharedPartnersRes.data).toStrictEqual({
      records: [
        {
          id: org2.session.orgId,
          displayName: "Example Org 2",
        },
      ],
    });

    const sharedMetricsRes = await org1.client.GET(
      "/u/measurement/metric/shared-metrics",
    );
    expect(sharedMetricsRes).toBeApiOk();
    expect(sharedMetricsRes.data).toStrictEqual({
      records: [
        {
          id: metricId,
          name: "Shared Metric",
        },
      ],
    });
  });

  it("partner should be able to get shared metrics via getAll with or without partnerId", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });
    await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    const createRes = await org1.client.POST("/u/measurement/metric/item", {
      body: {
        name: "Partnered Energy Metric",
        description: "Energy consumption",
        unitGroup: "ENERGY",
        type: "COUNTER",
      },
    });
    const metricId = createRes.data!.id;

    await org1.client.PUT("/u/measurement/metric/share/{id}", {
      params: { path: { id: metricId } },
      body: { partnerIds: [org2.session.orgId] },
    });

    const getAllRes = await org2.client.GET("/u/measurement/metric/item");
    expect(getAllRes).toBeApiOk();

    const fetchedMetric = getAllRes.data!.records.find(
      (r) => r.id === metricId,
    );
    expect(fetchedMetric).toBeDefined();
    expect(fetchedMetric).toMatchObject({
      id: metricId,
      name: "Partnered Energy Metric",
      type: "COUNTER",
      unitGroup: "ENERGY",
    });

    const getByPartnerIdRes = await org2.client.GET(
      "/u/measurement/metric/item",
      {
        params: { query: { partnerId: org1.session.orgId } },
      },
    );
    expect(getByPartnerIdRes).toBeApiOk();
    expect(getByPartnerIdRes.data!.records.length).toBe(1);
    expect(getByPartnerIdRes.data!.records[0].id).toBe(metricId);

    const getSelfPartnerIdRes = await org1.client.GET(
      "/u/measurement/metric/item",
      {
        params: { query: { partnerId: org1.session.orgId } },
      },
    );
    expect(getSelfPartnerIdRes).toBeApiOk();
    expect(
      getSelfPartnerIdRes.data!.records.some((r) => r.id === metricId),
    ).toBeTruthy();
  });

  it("partner should be able to remove (unshare) a metric from their own list", async () => {
    const org1 = await UtilTest.createClientLoggedIn();
    const partnerToken = await org1.client.PUT("/u/organization/partner/token");

    const org2 = await UtilTest.createClientLoggedIn({
      username: "admin@example2.com",
    });
    await org2.client.POST("/u/organization/partner/item", {
      body: { token: partnerToken.data!.token },
    });

    const createRes = await org1.client.POST("/u/measurement/metric/item", {
      body: {
        name: "Temporary Metric",
        description: "Will be removed by partner",
        unitGroup: "TEMPERATURE",
        type: "GAUGE",
      },
    });
    const metricId = createRes.data!.id;

    await org1.client.PUT("/u/measurement/metric/share/{id}", {
      params: { path: { id: metricId } },
      body: { partnerIds: [org2.session.orgId] },
    });

    let org2Metrics = await org2.client.GET("/u/measurement/metric/item", {
      params: { query: { partnerId: org1.session.orgId } },
    });
    expect(org2Metrics.data!.records.length).toBe(1);

    const removeShareRes = await org2.client.DELETE(
      "/u/measurement/metric/shared/{id}",
      {
        params: { path: { id: metricId } },
      },
    );
    expect(removeShareRes).toBeApiOk();

    org2Metrics = await org2.client.GET("/u/measurement/metric/item", {
      params: { query: { partnerId: org1.session.orgId } },
    });
    expect(org2Metrics).toBeApiOk();
    expect(org2Metrics.data!.records.length).toBe(0);

    const org1Metrics = await org1.client.GET(
      "/u/measurement/metric/item/{id}",
      {
        params: { path: { id: metricId } },
      },
    );
    expect(org1Metrics).toBeApiOk();
  });
});
