import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ServiceDb } from "@m/core/services/ServiceDb";
import { TestHelperMeter } from "@m/measurement/test/TestHelperMeter";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";

import { TbLinearRegressionResult } from "../orm/TbLinearRegressionResult";

describe("E2E - RouterLinearRegression", () => {
  async function addValues(
    orgId: string,
    metricId1: string,
    metricId2: string,
    driverId: string,
  ) {
    await TestHelperMetric.addValues(orgId, metricId1, [
      { value: 0, datetime: "2024-12-31T00:00:00Z" },
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 3, datetime: "2025-02-02T00:00:00Z" },
      { value: 6, datetime: "2025-03-03T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(orgId, metricId2, [
      { value: 0, datetime: "2024-12-31T00:00:00Z" },
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 3, datetime: "2025-02-02T00:00:00Z" },
      { value: 4, datetime: "2025-03-03T00:00:00Z" },
    ]);

    return await TestHelperMetric.addValues(orgId, driverId, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 4, datetime: "2025-02-02T00:00:00Z" },
      { value: 6, datetime: "2025-03-03T00:00:00Z" },
    ]);
  }

  it("should calculate", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const driver = await TestHelperMetric.create(client, "Driver");
    const meter1 = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");

    const slices = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    const meterSliceIds = slices.data!.records.map((d) => d.id);

    await addValues(session.orgId, meter1.metricId, meter2.metricId, driver.id);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-05-01T00:00:00Z";
    const regressionResult = await client.POST(
      "/u/analysis/linear-regression/run",
      {
        body: {
          meterSliceIds,
          driverId: driver.id,
          datetimeStart,
          datetimeEnd,
        },
      },
    );

    expect(regressionResult).toBeApiOk();

    expect(regressionResult.data).toStrictEqual({
      slope: 3,
      intercept: -6,
      rSquared: 0.75,
      dataPoints: [
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 6 },
      ],
      ignoredRecordCount: 0,
      // interpolateRate: 0,
      // interpolatedRecordCount: 0,
      period: "DAILY",
    });
  });

  it("should save result", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Slice");
    const meter2 = await TestHelperMeter.create(client, "Slice 2");
    const slices = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    const meterSliceIds = slices.data!.records.map((d) => d.id);

    const driver = await TestHelperMetric.create(client, "Driver");

    await addValues(session.orgId, meter1.metricId, meter2.metricId, driver.id);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-05-01T00:00:00Z";

    const resCommit = await client.POST(
      "/u/analysis/linear-regression/commit",
      {
        body: {
          meterSliceIds,
          driverId: driver.id,
          datetimeStart,
          datetimeEnd,
        },
      },
    );
    expect(resCommit).toBeApiOk();

    const results = await client.GET("/u/analysis/linear-regression/results");
    expect(results).toBeApiOk();
    expect(results.data).toStrictEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(String),
        slope: 3,
        intercept: -6,
        rSquared: 0.75,
        datetimeStart: "2024-12-01T00:00:00.000Z",
        datetimeEnd: "2025-05-01T00:00:00.000Z",
        period: "DAILY",
        ignoredRecordCount: 0,
        // interpolateRate: 0,
        // interpolatedRecordCount: 0,
        energyResource: "ELECTRIC",
        driver: {
          id: driver.id,
          name: "Driver",
          unitGroup: "TEMPERATURE",
        },
        meterSlices: slices.data?.records.map((d) => ({
          id: d.id,
          name: `${d.metric.name} - ${d.department.name}`,
        })),
      },
    ]);
  });

  it("should get all results", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Slice");
    const meter2 = await TestHelperMeter.create(client, "Slice 2");
    const slices = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });
    const meterSliceIds = slices.data!.records.map((d) => d.id);

    const driver = await TestHelperMetric.create(client, "Driver");

    await addValues(session.orgId, meter1.metricId, meter2.metricId, driver.id);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-05-01T00:00:00Z";

    await client.POST("/u/analysis/linear-regression/commit", {
      body: {
        meterSliceIds,
        driverId: driver.id,
        datetimeStart,
        datetimeEnd,
      },
    });
    const results = await client.GET("/u/analysis/linear-regression/results");
    expect(results.data).toStrictEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(String),
        slope: 3,
        intercept: -6,
        rSquared: 0.75,
        datetimeStart: "2024-12-01T00:00:00.000Z",
        datetimeEnd: "2025-05-01T00:00:00.000Z",
        period: "DAILY",
        ignoredRecordCount: 0,
        // interpolateRate: 0,
        // interpolatedRecordCount: 0,
        energyResource: "ELECTRIC",
        driver: {
          id: driver.id,
          name: "Driver",
          unitGroup: "TEMPERATURE",
        },
        meterSlices: slices.data?.records.map((d) => ({
          id: d.id,
          name: `${d.metric.name} - ${d.department.name}`,
        })),
      },
    ]);
  });

  it("should get one result", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");
    const meterSliceIds = [meter1.sliceId, meter2.sliceId];

    const driver = await TestHelperMetric.create(client, "Driver", {
      unitGroup: "TEMPERATURE",
    });

    await addValues(session.orgId, meter1.metricId, meter2.metricId, driver.id);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-05-01T00:00:00Z";

    await client.POST("/u/analysis/linear-regression/commit", {
      body: {
        meterSliceIds,
        driverId: driver.id,
        datetimeStart,
        datetimeEnd,
      },
    });

    const selectId = await ServiceDb.get()
      .select({ id: TbLinearRegressionResult.id })
      .from(TbLinearRegressionResult)
      .where(eq(TbLinearRegressionResult.orgId, session.orgId));
    const resultId = selectId[0]?.id;

    const result = await client.GET(
      "/u/analysis/linear-regression/values/{resultId}",
      { params: { path: { resultId: resultId } } },
    );

    const orderedResult = {
      ...result.data!.result,
      meterSlices: result.data!.result.meterSlices.sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
    };
    expect(orderedResult).toStrictEqual({
      id: resultId,
      slope: 3,
      intercept: -6,
      rSquared: 0.75,
      energyResource: "ELECTRIC",
      ignoredRecordCount: 0,
      // interpolateRate: 0,
      // interpolatedRecordCount: 0,
      meterSlices: [
        { id: meter1.sliceId, name: "Metric:Meter 1 - Department:Meter 1" },
        { id: meter2.sliceId, name: "Metric:Meter 2 - Department:Meter 2" },
      ].sort((a, b) => a.id.localeCompare(b.id)),
      driver: {
        id: driver.id,
        name: "Driver",
        unitGroup: "TEMPERATURE",
      },
      period: "DAILY",
      values: [
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 6 },
      ],
      datetimeStart: "2024-12-01T00:00:00.000Z",
      datetimeEnd: "2025-05-01T00:00:00.000Z",
      createdAt: expect.any(String),
    });
  });

  it("should truncate and interpolate unstable data", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Meter 1");
    const meter2 = await TestHelperMeter.create(client, "Meter 2");
    const meterSliceIds = [meter1.sliceId, meter2.sliceId];

    const driver = await TestHelperMetric.create(client, "Driver");

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-31T00:00:00Z" },
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-01-02T00:00:00Z" },
      { value: 4, datetime: "2025-01-03T00:00:00Z" },
      { value: 8, datetime: "2025-01-04T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-31T00:00:00Z" },
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 3, datetime: "2025-01-02T00:00:00Z" },
      { value: 4, datetime: "2025-01-03T00:00:00Z" },
      { value: 4, datetime: "2025-01-04T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver.id, [
      { value: 0, datetime: "2024-12-31T00:00:00Z" },
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 3, datetime: "2025-01-02T00:00:00Z" },
      { value: 5, datetime: "2025-01-03T00:00:00Z" },
      { value: 6, datetime: "2025-01-04T00:00:00Z" },
    ]);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-01-04T00:00:00Z";

    const resCommit = await client.POST(
      "/u/analysis/linear-regression/commit",
      {
        body: {
          meterSliceIds,
          driverId: driver.id,
          datetimeStart,
          datetimeEnd,
        },
      },
    );

    expect(resCommit).toBeApiOk();

    const selectId = await ServiceDb.get()
      .select({ id: TbLinearRegressionResult.id })
      .from(TbLinearRegressionResult)
      .where(eq(TbLinearRegressionResult.orgId, session.orgId));
    const resultId = selectId[0]?.id;

    const result = await client.GET(
      "/u/analysis/linear-regression/values/{resultId}",
      { params: { path: { resultId: resultId } } },
    );

    expect(result).toBeApiOk();

    const orderedResult = {
      ...result.data!.result,
      meterSlices: result.data!.result.meterSlices.sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
    };
    expect(orderedResult).toStrictEqual({
      id: resultId,
      slope: 1.5,
      intercept: -0.5,
      rSquared: 0.45,
      energyResource: "ELECTRIC",
      // interpolatedRecordCount: 1,
      // interpolateRate: 0.16666667, // 1 / 6,
      ignoredRecordCount: 0,
      meterSlices: [
        { id: meter1.sliceId, name: "Metric:Meter 1 - Department:Meter 1" },
        { id: meter2.sliceId, name: "Metric:Meter 2 - Department:Meter 2" },
      ].sort((a, b) => a.id.localeCompare(b.id)),
      driver: {
        id: driver.id,
        name: "Driver",
        unitGroup: "TEMPERATURE",
      },
      period: "DAILY",
      values: [
        { x: 3, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        { x: 4, y: 6 },
      ],
      datetimeStart: "2024-12-01T00:00:00.000Z",
      datetimeEnd: "2025-01-04T00:00:00.000Z",
      createdAt: expect.any(String),
    });
  });

  it("should delete the result", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const meter1 = await TestHelperMeter.create(client, "Slice");
    const meter2 = await TestHelperMeter.create(client, "Slice 2");

    const slices = await client.GET("/u/measurement/meter/slice", {
      params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
    });

    const meterSliceIds = slices.data!.records.map((d) => d.id);
    const driver = await TestHelperMetric.create(client, "Driver");

    await addValues(session.orgId, meter1.metricId, meter2.metricId, driver.id);

    const datetimeStart = "2024-12-01T00:00:00Z";
    const datetimeEnd = "2025-05-01T00:00:00Z";

    await client.POST("/u/analysis/linear-regression/commit", {
      body: {
        meterSliceIds,
        driverId: driver.id,
        datetimeStart,
        datetimeEnd,
      },
    });

    const selectId = await ServiceDb.get()
      .select({ id: TbLinearRegressionResult.id })
      .from(TbLinearRegressionResult)
      .where(eq(TbLinearRegressionResult.orgId, session.orgId));
    const resultId = selectId[0]?.id;

    await client.DELETE("/u/analysis/linear-regression/results/{resultId}", {
      params: { path: { resultId: resultId } },
    });

    const results = await client.GET("/u/analysis/linear-regression/results");

    expect(results.data).toStrictEqual([]);
  });
});
