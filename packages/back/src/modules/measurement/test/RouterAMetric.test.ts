import { EApiFailCode } from "common";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceDb } from "@m/core/services/ServiceDb";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbMetricResource } from "../orm/TbMetricResource";
import { TbMetricResourceValueRaw } from "../orm/TbMetricResourceValueRaw";
import { TestHelperInboundIntegration } from "./TestHelperInboundIntegration";
import { TestHelperMetric } from "./TestHelperMetric";

describe("E2E - RouterAMetric", () => {
  it("set metric values using inbound integration webhook", async () => {
    const { client: clientUser, session } =
      await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(clientUser, "test", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const integration = await TestHelperInboundIntegration.create(
      clientUser,
      { type: "WEBHOOK" },
      metric.id,
    );

    const { client } = await UtilTest.createClientWithAccessToken({
      permMetricResourceValueMetricIds: [metric.id],
    });
    const resAddValues = await client.POST("/a/metric/hooks/{id}", {
      params: { path: { id: integration.id } },
      body: { values: [{ datetime: "2025-01-01T00:00:00.000Z", value: 1 }] },
    });
    expect(resAddValues).toBeApiOk();

    const values = await ServiceDb.get()
      .select({
        orgId: TbMetricResourceValueRaw.orgId,
        value: TbMetricResourceValueRaw.value,
        datetime: UtilDb.isoDatetime(TbMetricResourceValueRaw.datetime),
      })
      .from(TbMetricResourceValueRaw)
      .innerJoin(
        TbMetricResource,
        eq(TbMetricResource.id, TbMetricResourceValueRaw.resourceId),
      )
      .where(eq(TbMetricResource.metricId, metric.id));

    expect(values).toStrictEqual([
      {
        orgId: session.orgId,
        value: 1,
        datetime: "2025-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("set metric values should be converted respect to unit", async () => {
    const { client: clientUser, session } =
      await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(clientUser, "test", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const integration = await TestHelperInboundIntegration.create(
      clientUser,
      { type: "WEBHOOK" },
      metric.id,
      "ENERGY_MWH",
    );

    const { client } = await UtilTest.createClientWithAccessToken({
      permMetricResourceValueMetricIds: [metric.id],
    });
    const resAddValues = await client.POST("/a/metric/hooks/{id}", {
      params: { path: { id: integration.id } },
      body: { values: [{ datetime: "2025-01-01T00:00:00.000Z", value: 1 }] },
    });
    expect(resAddValues).toBeApiOk();

    const values = await ServiceDb.get()
      .select({
        orgId: TbMetricResourceValueRaw.orgId,
        value: TbMetricResourceValueRaw.value,
        datetime: UtilDb.isoDatetime(TbMetricResourceValueRaw.datetime),
      })
      .from(TbMetricResourceValueRaw)
      .innerJoin(
        TbMetricResource,
        eq(TbMetricResource.id, TbMetricResourceValueRaw.resourceId),
      )
      .where(eq(TbMetricResource.metricId, metric.id));

    expect(values).toStrictEqual([
      {
        orgId: session.orgId,
        value: 1000,
        datetime: "2025-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("get metric values", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(clientUser, "test", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const integration = await TestHelperInboundIntegration.create(
      clientUser,
      { type: "WEBHOOK" },
      metric.id,
    );

    const { client } = await UtilTest.createClientWithAccessToken({
      permMetricResourceValueMetricIds: [metric.id],
    });

    const resAddValues = await client.POST("/a/metric/hooks/{id}", {
      params: { path: { id: integration.id } },
      body: {
        values: [
          { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
          { datetime: "2025-01-02T00:00:00.000Z", value: 10 },
        ],
      },
    });
    expect(resAddValues).toBeApiOk();

    // Actual test; fetch values
    const res = await client.GET("/a/metric/values/{id}", {
      params: {
        query: {
          period: "MINUTELY",
          datetimeMin: "2025-01-01T00:00:00Z",
          datetimeMax: "2025-03-01T00:00:00Z",
        },
        path: { id: metric.id },
      },
    });
    expect(res).toBeApiOk();
    expect(res.data?.records).toStrictEqual([
      {
        datetime: "2025-01-02T00:00:00.000Z",
        value: 10,
        sampleCount: 1,
      },
    ]);
  });

  it("set not permitted metric id using webhook", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();
    const metric = await TestHelperMetric.create(clientUser, "test", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });
    const integration = await TestHelperInboundIntegration.create(
      clientUser,
      { type: "WEBHOOK" },
      metric.id,
    );

    const { client } = await UtilTest.createClientWithAccessToken();
    const resAddValues = await client.POST("/a/metric/hooks/{id}", {
      params: { path: { id: integration.id } },
      body: { values: [{ datetime: "2025-01-01T00:00:00.000Z", value: 1 }] },
    });
    expect(resAddValues).toBeApiError(EApiFailCode.FORBIDDEN);
  });

  it("get not permitted metric values", async () => {
    const { client: clientUser } = await UtilTest.createClientLoggedIn();

    const metric = await TestHelperMetric.create(clientUser, "test", {
      unitGroup: "ENERGY",
      type: "COUNTER",
    });

    const { client } = await UtilTest.createClientWithAccessToken();
    const res = await client.GET("/a/metric/values/{id}", {
      params: {
        query: {
          period: "MINUTELY",
          ...TestHelperMetric.getFullDatetimeRangeQuery(),
        },
        path: { id: metric.id },
      },
    });
    expect(res).toBeApiError(EApiFailCode.FORBIDDEN);
  });
});
