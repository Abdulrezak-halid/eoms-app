import { EApiFailCode } from "common";
import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { TestHelperDepartment } from "@m/base/test/TestHelperDepartment";
import { ServiceDb } from "@m/core/services/ServiceDb";
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";
import { TestHelperMeter } from "@m/measurement/test/TestHelperMeter";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";
import { TestHelperSeu } from "@m/measurement/test/TestHelperSeu";

import { TbAdvancedRegressionResult } from "../orm/TbAdvancedRegressionResult";

describe("E2E - RouterAdvancedRegression", () => {
  async function addValue(
    orgId: string,
    metricId1: string,
    metricId2: string,
    driverId1: string,
    driverId2: string,
  ) {
    const metricResourceId1 = await TestHelperMetric.addValues(
      orgId,
      metricId1,
      [
        { value: 0, datetime: "2024-12-01T00:00:00Z" },
        { value: 10, datetime: "2025-01-01T00:00:00Z" },
        { value: 22, datetime: "2025-02-01T00:00:00Z" },
        { value: 36, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const metricResourceId2 = await TestHelperMetric.addValues(
      orgId,
      metricId2,
      [
        { value: 0, datetime: "2024-12-01T00:00:00Z" },
        { value: 18, datetime: "2025-01-01T00:00:00Z" },
        { value: 38, datetime: "2025-02-01T00:00:00Z" },
        { value: 63, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const driverResourceId1 = await TestHelperMetric.addValues(
      orgId,
      driverId1,
      [
        { value: 5, datetime: "2025-01-01T00:00:00Z" },
        { value: 10, datetime: "2025-02-01T00:00:00Z" },
        { value: 15, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    const driverResourceId2 = await TestHelperMetric.addValues(
      orgId,
      driverId2,
      [
        { value: 5, datetime: "2025-01-01T00:00:00Z" },
        { value: 12, datetime: "2025-02-01T00:00:00Z" },
        { value: 17, datetime: "2025-03-01T00:00:00Z" },
      ],
    );

    return {
      metricResourceId1,
      metricResourceId2,
      driverResourceId1,
      driverResourceId2,
    };
  }

  it("Calculate advanced regression", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const regressionResult = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2024-12-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2024-12-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(regressionResult).toBeApiOk();

    expect(regressionResult.data).toStrictEqual({
      period: "DAILY",
      trainRecordIgnoredCount: 0,
      // trainRecordInterpolateRate: 0,
      // trainRecordInterpolatedCount: 0,
      rSquared: 1,
      rmse: 0,
      expectedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      observedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      differenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
      cumulativeDifferenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
      sourceDrivers: expect.arrayContaining([
        {
          id: driver1.id,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 5,
            },
            {
              datetime: "2025-02-01T00:00:00.000Z",
              value: 10,
            },
            {
              datetime: "2025-03-01T00:00:00.000Z",
              value: 15,
            },
          ],
        },
        {
          id: driver2.id,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 5,
            },
            {
              datetime: "2025-02-01T00:00:00.000Z",
              value: 12,
            },
            {
              datetime: "2025-03-01T00:00:00.000Z",
              value: 17,
            },
          ],
        },
      ]),
      sourceMeterSlices: expect.arrayContaining([
        {
          id: meter1.sliceId,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 10,
            },
            {
              datetime: "2025-02-01T00:00:00.000Z",
              value: 12,
            },
            {
              datetime: "2025-03-01T00:00:00.000Z",
              value: 14,
            },
          ],
        },
        {
          id: meter2.sliceId,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 18,
            },
            {
              datetime: "2025-02-01T00:00:00.000Z",
              value: 20,
            },
            {
              datetime: "2025-03-01T00:00:00.000Z",
              value: 25,
            },
          ],
        },
      ]),
    });
  });

  it("Predict future daily values with multiple drivers", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(client, "Test Dept");
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");
    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    const seuId = seu.data!.id;
    const orgId = session.orgId;

    // Training period: 2025-01-01 to 2025-01-06
    const datesTrain = [
      "2024-12-31T00:00:00Z",
      "2025-01-01T00:00:00Z",
      "2025-01-02T00:00:00Z",
      "2025-01-03T00:00:00Z",
      "2025-01-04T00:00:00Z",
      "2025-01-05T00:00:00Z",
      "2025-01-06T00:00:00Z",
    ];

    // Prediction period : 2025-01-07 to 2025-01-11
    const datesPredictOnly = [
      "2025-01-07T00:00:00Z",
      "2025-01-08T00:00:00Z",
      "2025-01-09T00:00:00Z",
      "2025-01-10T00:00:00Z",
      "2025-01-11T00:00:00Z",
    ];

    const metric1Values = [0, 10, 22, 36, 52, 70, 90];
    const metric2Values = [0, 5, 11, 18, 26, 35, 45];

    const driver1TrainValues = [0, 1, 2, 3, 4, 5, 6];
    const driver2TrainValues = [0, 2, 4, 6, 8, 10, 12];

    const driver1PredictValues = [7, 8, 9, 10, 11];
    const driver2PredictValues = [14, 16, 18, 20, 22];

    await TestHelperMetric.addValues(
      orgId,
      meter1.metricId,
      metric1Values.map((v, i) => ({
        value: v,
        datetime: datesTrain[i],
      })),
    );

    await TestHelperMetric.addValues(
      orgId,
      meter2.metricId,
      metric2Values.map((v, i) => ({
        value: v,
        datetime: datesTrain[i],
      })),
    );

    await TestHelperMetric.addValues(
      orgId,
      driver1.id,
      driver1TrainValues.map((v, i) => ({
        value: v,
        datetime: datesTrain[i],
      })),
    );

    await TestHelperMetric.addValues(
      orgId,
      driver2.id,
      driver2TrainValues.map((v, i) => ({
        value: v,
        datetime: datesTrain[i],
      })),
    );

    await TestHelperMetric.addValues(
      orgId,
      driver1.id,
      driver1PredictValues.map((v, i) => ({
        value: v,
        datetime: datesPredictOnly[i],
      })),
    );

    await TestHelperMetric.addValues(
      orgId,
      driver2.id,
      driver2PredictValues.map((v, i) => ({
        value: v,
        datetime: datesPredictOnly[i],
      })),
    );

    const regressionResult = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-01-06T00:00:00Z",
          datePredictStart: "2025-01-06T00:00:00Z",
          datePredictEnd: "2025-01-11T00:00:00Z",
        },
      },
    );
    expect(regressionResult).toBeApiOk();
    expect(regressionResult.data).toStrictEqual({
      period: "HOURLY",
      trainRecordIgnoredCount: 0,
      rSquared: null,
      rmse: null,
      sourceDrivers: expect.arrayContaining([
        {
          id: driver1.id,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 1,
            },
            {
              datetime: "2025-01-02T00:00:00.000Z",
              value: 2,
            },
            {
              datetime: "2025-01-03T00:00:00.000Z",
              value: 3,
            },
            {
              datetime: "2025-01-04T00:00:00.000Z",
              value: 4,
            },
            {
              datetime: "2025-01-05T00:00:00.000Z",
              value: 5,
            },
            {
              datetime: "2025-01-06T00:00:00.000Z",
              value: 6,
            },
          ],
        },
        {
          id: driver2.id,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 2,
            },
            {
              datetime: "2025-01-02T00:00:00.000Z",
              value: 4,
            },
            {
              datetime: "2025-01-03T00:00:00.000Z",
              value: 6,
            },
            {
              datetime: "2025-01-04T00:00:00.000Z",
              value: 8,
            },
            {
              datetime: "2025-01-05T00:00:00.000Z",
              value: 10,
            },
            {
              datetime: "2025-01-06T00:00:00.000Z",
              value: 12,
            },
          ],
        },
      ]),
      sourceMeterSlices: expect.arrayContaining([
        {
          id: meter1.sliceId,
          values: [
            {
              datetime: "2025-01-02T00:00:00.000Z",
              value: 12,
            },
            {
              datetime: "2025-01-03T00:00:00.000Z",
              value: 14,
            },
            {
              datetime: "2025-01-04T00:00:00.000Z",
              value: 16,
            },
            {
              datetime: "2025-01-05T00:00:00.000Z",
              value: 18,
            },
            {
              datetime: "2025-01-06T00:00:00.000Z",
              value: 20,
            },
          ],
        },
        {
          id: meter2.sliceId,
          values: [
            {
              datetime: "2025-01-02T00:00:00.000Z",
              value: 6,
            },
            {
              datetime: "2025-01-03T00:00:00.000Z",
              value: 7,
            },
            {
              datetime: "2025-01-04T00:00:00.000Z",
              value: 8,
            },
            {
              datetime: "2025-01-05T00:00:00.000Z",
              value: 9,
            },
            {
              datetime: "2025-01-06T00:00:00.000Z",
              value: 10,
            },
          ],
        },
      ]),
      expectedValues: [
        { datetime: "2025-01-06T00:00:00.000Z", value: 30 },
        { datetime: "2025-01-07T00:00:00.000Z", value: 33 },
        { datetime: "2025-01-08T00:00:00.000Z", value: 36 },
        { datetime: "2025-01-09T00:00:00.000Z", value: 39 },
        { datetime: "2025-01-10T00:00:00.000Z", value: 42 },
        { datetime: "2025-01-11T00:00:00.000Z", value: 45 },
      ],
      observedValues: [],
      differenceValues: [],
      cumulativeDifferenceValues: [],
    });
  });

  it("Delete advanced regression", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2025-01-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2025-01-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    const selectId = await ServiceDb.get()
      .select({ id: TbAdvancedRegressionResult.id })
      .from(TbAdvancedRegressionResult)
      .where(eq(TbAdvancedRegressionResult.orgId, session.orgId));
    const resultId = selectId[0]?.id;

    await client.DELETE("/u/analysis/advanced-regression/result/{resultId}", {
      params: { path: { resultId: resultId } },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");
    expect(results.data).toStrictEqual({ records: [] });
  });

  it("Get advanced regression results", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const resCommit = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2024-12-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2024-12-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(resCommit).toBeApiOk();

    const results = await client.GET("/u/analysis/advanced-regression/result");
    expect(results).toBeApiOk();
    expect(results.data?.records).toHaveLength(1);

    const [result] = results.data!.records;

    expect(result).toStrictEqual({
      id: expect.any(String),
      period: "DAILY",
      primary: false,
      threshold: null,
      trainRecordIgnoredCount: 0,
      // trainRecordInterpolateRate: 0,
      // trainRecordInterpolatedCount: 0,
      rSquared: 1,
      rmse: 0,
      createdAt: expect.any(String),
      dateTrainStart: "2024-12-01T00:00:00.000Z",
      dateTrainEnd: "2025-03-01T00:00:00.000Z",
      datePredictStart: "2024-12-01T00:00:00.000Z",
      datePredictEnd: "2025-03-01T00:00:00.000Z",
      slices: [
        {
          id: meter1.sliceId,
          name: "Metric:meter1 - Department:meter1",
        },
        {
          id: meter2.sliceId,
          name: "Metric:meter2 - Department:meter2",
        },
      ],
      drivers: [
        {
          id: driver1.id,
          name: "driver1",
          unitGroup: "TEMPERATURE",
        },
        {
          id: driver2.id,
          name: "driver2",
          unitGroup: "TEMPERATURE",
        },
      ],
      seu: {
        id: seuId,
        name: "Test SEU",
      },
    });
  });

  it("Set primary", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createSeuWithValues(client, {
      name: "seu1",
    });
    const seu2 = await TestHelperSeu.createSeuWithValues(client, {
      name: "seu2",
    });

    const resRun1 = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          seuId: seu1.id,
          driverIds: [seu1.driverId1, seu1.driverId2],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(resRun1).toBeApiOk();

    const resRun2 = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          seuId: seu1.id,
          driverIds: [seu1.driverId1, seu1.driverId2],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(resRun2).toBeApiOk();

    const resRun3 = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          seuId: seu2.id,
          driverIds: [seu1.driverId1, seu1.driverId2],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(resRun3).toBeApiOk();

    // Initial primary set
    {
      const resSetPrimary = await client.PUT(
        "/u/analysis/advanced-regression/set-primary",
        {
          body: {
            id: resRun1.data!.id,
            value: true,
          },
        },
      );
      expect(resSetPrimary).toBeApiOk();

      const resResult1 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun1.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult1).toBeApiOk();
      expect(resResult1.data?.primary).toBe(true);

      const resResult2 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun2.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult2).toBeApiOk();
      expect(resResult2.data?.primary).toBe(false);

      const resResult3 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun3.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult3).toBeApiOk();
      expect(resResult3.data?.primary).toBe(false);
    }

    // Setting primary should unset primary for other records with the same seu
    {
      const resSetPrimary = await client.PUT(
        "/u/analysis/advanced-regression/set-primary",
        {
          body: {
            id: resRun2.data!.id,
            value: true,
          },
        },
      );
      expect(resSetPrimary).toBeApiOk();

      const resResult1 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun1.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult1).toBeApiOk();
      expect(resResult1.data?.primary).toBe(false);

      const resResult2 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun2.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult2).toBeApiOk();
      expect(resResult2.data?.primary).toBe(true);

      const resResult3 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun3.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult3).toBeApiOk();
      expect(resResult3.data?.primary).toBe(false);
    }

    // Setting primary should not unset primary for other records with deifferent seus
    {
      const resSetPrimary = await client.PUT(
        "/u/analysis/advanced-regression/set-primary",
        {
          body: {
            id: resRun3.data!.id,
            value: true,
          },
        },
      );
      expect(resSetPrimary).toBeApiOk();

      const resResult1 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun1.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult1).toBeApiOk();
      expect(resResult1.data?.primary).toBe(false);

      const resResult2 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun2.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult2).toBeApiOk();
      expect(resResult2.data?.primary).toBe(true);

      const resResult3 = await client.GET(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: {
            path: { resultId: resRun3.data!.id },
            query: { includeSources: "false" },
          },
        },
      );
      expect(resResult3).toBeApiOk();
      expect(resResult3.data?.primary).toBe(true);
    }
  });

  it("Get primary", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu1 = await TestHelperSeu.createSeuWithValues(client, {
      name: "seu1",
    });

    const reg1 = await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId: seu1.id,
        driverIds: [seu1.driverId1, seu1.driverId2],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    expect(reg1).toBeApiOk();

    const reg2 = await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId: seu1.id,
        driverIds: [seu1.driverId1, seu1.driverId2],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });
    expect(reg2).toBeApiOk();

    {
      const setPrimary = await client.PUT(
        "/u/analysis/advanced-regression/set-primary",
        {
          body: {
            id: reg1.data!.id,
            value: true,
          },
        },
      );
      expect(setPrimary).toBeApiOk();

      const res = await client.GET("/u/analysis/advanced-regression/result", {
        params: { query: { primary: "true" } },
      });

      expect(res).toBeApiOk();
      expect(res.data).toStrictEqual({
        records: [
          {
            createdAt: res.data?.records[0].createdAt,
            dateTrainStart: "2024-12-01T00:00:00.000Z",
            dateTrainEnd: "2025-03-01T00:00:00.000Z",
            datePredictStart: "2024-12-01T00:00:00.000Z",
            datePredictEnd: "2025-03-01T00:00:00.000Z",
            slices: [
              {
                id: expect.any(String),
                name: "Metric:seu1:meter1 - Department:seu1:meter1",
              },
              {
                id: expect.any(String),
                name: "Metric:seu1:meter2 - Department:seu1:meter2",
              },
            ],
            drivers: [
              {
                id: seu1.driverId1,
                name: "seu1:driver1",
                unitGroup: "TEMPERATURE",
              },
              {
                id: seu1.driverId2,
                name: "seu1:driver2",
                unitGroup: "TEMPERATURE",
              },
            ],
            id: reg1.data?.id,
            period: "DAILY",
            primary: true,
            rSquared: null,
            rmse: 0,
            seu: {
              id: seu1.id,
              name: "seu1",
            },
            threshold: null,
            trainRecordIgnoredCount: 0,
            // trainRecordInterpolateRate: 0,
            // trainRecordInterpolatedCount: 0,
          },
        ],
      });
    }
  });

  it("Set threshold", async () => {
    const { client } = await UtilTest.createClientLoggedIn();

    const seu = await TestHelperSeu.createSeuWithValues(client);

    const resRun = await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId: seu.id,
        driverIds: [seu.driverId1],
        dateTrainStart: "2025-01-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2025-01-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });
    expect(resRun).toBeApiOk();
    const regressionResultId = resRun.data!.id;

    await client.PUT("/u/analysis/advanced-regression/set-threshold", {
      body: {
        id: regressionResultId,
        value: 10,
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");
    expect(results).toBeApiOk();
    expect(results.data?.records).toHaveLength(1);

    const [result] = results.data!.records;
    expect(result.threshold).toBe(10);
  });

  it("Get advanced regression result with values", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");
    expect(results).toBeApiOk();
    expect(results.data?.records).toHaveLength(1);

    const res = await client.GET(
      "/u/analysis/advanced-regression/result/{resultId}",
      {
        params: {
          path: { resultId: results.data!.records![0].id },
          query: { includeSources: "false" },
        },
      },
    );
    expect(res).toBeApiOk();

    const result = res.data!;

    expect(result).toStrictEqual({
      id: expect.any(String),
      period: "DAILY",
      primary: false,
      threshold: null,
      trainRecordIgnoredCount: 0,
      // trainRecordInterpolateRate: 0,
      // trainRecordInterpolatedCount: 0,
      rSquared: 1,
      rmse: 0,
      createdAt: expect.any(String),
      dateTrainStart: "2024-12-01T00:00:00.000Z",
      dateTrainEnd: "2025-03-01T00:00:00.000Z",
      datePredictStart: "2024-12-01T00:00:00.000Z",
      datePredictEnd: "2025-03-01T00:00:00.000Z",

      sourceDrivers: [],
      sourceMeterSlices: [],

      slices: [
        {
          id: meter1.sliceId,
          name: "Metric:meter1 - Department:meter1",
        },
        {
          id: meter2.sliceId,
          name: "Metric:meter2 - Department:meter2",
        },
      ],
      drivers: [
        {
          id: driver1.id,
          name: "driver1",
          unitGroup: "TEMPERATURE",
        },
        {
          id: driver2.id,
          name: "driver2",
          unitGroup: "TEMPERATURE",
        },
      ],

      seu: {
        id: seuId,
        name: "Test SEU",
      },

      expectedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      observedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      differenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
      cumulativeDifferenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
    });
  });

  it("should produce consistent results regardless of metric ID order", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const regressionResultRef = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );

    const regressionResult1 = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );

    const regressionResult2 = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );

    const expectedResult = {
      ...regressionResultRef.data,
    };

    expect(regressionResult1.data).toStrictEqual(expectedResult);
    expect(regressionResult2.data).toStrictEqual(expectedResult);
  });

  it("Get latest advanced regression result", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    const res = await client.GET(
      "/u/analysis/advanced-regression/latest/result",
      {
        params: {
          query: { includeSources: "false" },
        },
      },
    );
    expect(res).toBeApiOk();

    const result = res.data!;

    expect(result).toStrictEqual({
      id: expect.any(String),
      period: "DAILY",
      primary: false,
      threshold: null,
      trainRecordIgnoredCount: 0,
      // trainRecordInterpolateRate: 0,
      // trainRecordInterpolatedCount: 0,
      createdAt: expect.any(String),
      dateTrainStart: "2024-12-01T00:00:00.000Z",
      dateTrainEnd: "2025-03-01T00:00:00.000Z",
      datePredictStart: "2024-12-01T00:00:00.000Z",
      datePredictEnd: "2025-03-01T00:00:00.000Z",

      sourceDrivers: [],
      sourceMeterSlices: [],

      rSquared: 1,
      rmse: 0,
      slices: [
        {
          id: meter1.sliceId,
          name: "Metric:meter1 - Department:meter1",
        },
        {
          id: meter2.sliceId,
          name: "Metric:meter2 - Department:meter2",
        },
      ],
      drivers: [
        {
          id: driver1.id,
          name: "driver1",
          unitGroup: "TEMPERATURE",
        },
        {
          id: driver2.id,
          name: "driver2",
          unitGroup: "TEMPERATURE",
        },
      ],

      seu: {
        id: seuId,
        name: "Test SEU",
      },

      expectedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      observedValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 28 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 32 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 39 },
      ],
      differenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
      cumulativeDifferenceValues: [
        { datetime: "2025-01-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-02-01T00:00:00.000Z", value: 0 },
        { datetime: "2025-03-01T00:00:00.000Z", value: 0 },
      ],
    });
  });

  it("Save advanced regression", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-03-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-03-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");
    expect(results).toBeApiOk();
    expect(results.data?.records).toHaveLength(1);

    const [result] = results.data!.records!;

    expect(result).toStrictEqual({
      id: expect.any(String),
      period: "DAILY",
      primary: false,
      threshold: null,
      rSquared: 1,
      rmse: 0,
      trainRecordIgnoredCount: 0,
      // trainRecordInterpolateRate: 0,
      // trainRecordInterpolatedCount: 0,
      createdAt: expect.any(String),
      dateTrainStart: "2024-12-01T00:00:00.000Z",
      dateTrainEnd: "2025-03-01T00:00:00.000Z",
      datePredictStart: "2024-12-01T00:00:00.000Z",
      datePredictEnd: "2025-03-01T00:00:00.000Z",
      slices: [
        {
          id: meter1.sliceId,
          name: "Metric:meter1 - Department:meter1",
        },
        {
          id: meter2.sliceId,
          name: "Metric:meter2 - Department:meter2",
        },
      ],
      drivers: [
        {
          id: driver1.id,
          name: "driver1",
          unitGroup: "TEMPERATURE",
        },
        {
          id: driver2.id,
          name: "driver2",
          unitGroup: "TEMPERATURE",
        },
      ],
      seu: {
        id: seuId,
        name: "Test SEU",
      },
    });
  });

  it("Get Advanced regression with high fit rSquare.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");
    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 12, datetime: "2025-01-01T00:00:00Z" },
      { value: 30, datetime: "2025-02-01T00:00:00Z" },
      { value: 58, datetime: "2025-03-01T00:00:00Z" },
      { value: 103, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 22, datetime: "2025-01-01T00:00:00Z" },
      { value: 50, datetime: "2025-02-01T00:00:00Z" },
      { value: 88, datetime: "2025-03-01T00:00:00Z" },
      { value: 143, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T00:00:00Z" },
      { value: 3, datetime: "2025-03-01T00:00:00Z" },
      { value: 4, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 4, datetime: "2025-02-01T00:00:00Z" },
      { value: 6, datetime: "2025-03-01T00:00:00Z" },
      { value: 8, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-04-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-04-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");

    expect(results).toBeApiOk();

    expect(results.data!.records![0].rSquared).toBe(0.951); // 0.9 - 1
  });

  it("Get advanced regression with poor fit rSquare.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");
    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 50, datetime: "2025-01-01T00:00:00Z" },
      { value: 65, datetime: "2025-02-01T00:00:00Z" },
      { value: 100, datetime: "2025-03-01T00:00:00Z" },
      { value: 120, datetime: "2025-04-01T00:00:00Z" },
      { value: 165, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 10, datetime: "2025-01-01T00:00:00Z" },
      { value: 50, datetime: "2025-02-01T00:00:00Z" },
      { value: 65, datetime: "2025-03-01T00:00:00Z" },
      { value: 100, datetime: "2025-04-01T00:00:00Z" },
      { value: 125, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T00:00:00Z" },
      { value: 3, datetime: "2025-03-01T00:00:00Z" },
      { value: 4, datetime: "2025-04-01T00:00:00Z" },
      { value: 5, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 4, datetime: "2025-02-01T00:00:00Z" },
      { value: 6, datetime: "2025-03-01T00:00:00Z" },
      { value: 8, datetime: "2025-04-01T00:00:00Z" },
      { value: 10, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-05-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-05-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");

    expect(results.data!.records![0].rSquared).toBe(0.174); // 0.1 - 0.2
  });

  it("Get Advanced regression with high fit rmse.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 14, datetime: "2025-01-01T00:00:00Z" },
      { value: 42, datetime: "2025-02-01T00:00:00Z" },
      { value: 84, datetime: "2025-03-01T00:00:00Z" },
      { value: 140, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 14, datetime: "2025-01-01T00:00:00Z" },
      { value: 42, datetime: "2025-02-01T00:00:00Z" },
      { value: 84, datetime: "2025-03-01T00:00:00Z" },
      { value: 140, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T00:00:00Z" },
      { value: 3, datetime: "2025-03-01T00:00:00Z" },
      { value: 4, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 4, datetime: "2025-02-01T00:00:00Z" },
      { value: 6, datetime: "2025-03-01T00:00:00Z" },
      { value: 8, datetime: "2025-04-01T00:00:00Z" },
    ]);

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2025-01-01T00:00:00Z",
        dateTrainEnd: "2025-04-01T00:00:00Z",
        datePredictStart: "2025-01-01T00:00:00Z",
        datePredictEnd: "2025-04-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");

    expect(results).toBeApiOk();

    expect(results.data!.records![0].rmse).toBe(0);
  });

  it("Get advanced regression with poor fit rmse.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );
    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");
    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await TestHelperMetric.addValues(session.orgId, meter1.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 50, datetime: "2025-01-01T00:00:00Z" },
      { value: 62, datetime: "2025-02-01T00:00:00Z" },
      { value: 99, datetime: "2025-03-01T00:00:00Z" },
      { value: 117, datetime: "2025-04-01T00:00:00Z" },
      { value: 161, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, meter2.metricId, [
      { value: 0, datetime: "2024-12-01T00:00:00Z" },
      { value: 20, datetime: "2025-01-01T00:00:00Z" },
      { value: 80, datetime: "2025-02-01T00:00:00Z" },
      { value: 105, datetime: "2025-03-01T00:00:00Z" },
      { value: 140, datetime: "2025-04-01T00:00:00Z" },
      { value: 150, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver1.id, [
      { value: 1, datetime: "2025-01-01T00:00:00Z" },
      { value: 2, datetime: "2025-02-01T00:00:00Z" },
      { value: 3, datetime: "2025-03-01T00:00:00Z" },
      { value: 4, datetime: "2025-04-01T00:00:00Z" },
      { value: 5, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(session.orgId, driver2.id, [
      { value: 2, datetime: "2025-01-01T00:00:00Z" },
      { value: 4, datetime: "2025-02-01T00:00:00Z" },
      { value: 6, datetime: "2025-03-01T00:00:00Z" },
      { value: 8, datetime: "2025-04-01T00:00:00Z" },
      { value: 10, datetime: "2025-05-01T00:00:00Z" },
    ]);

    await client.POST("/u/analysis/advanced-regression/commit", {
      body: {
        seuId,
        driverIds: [driver1.id, driver2.id],
        dateTrainStart: "2024-12-01T00:00:00Z",
        dateTrainEnd: "2025-05-01T00:00:00Z",
        datePredictStart: "2024-12-01T00:00:00Z",
        datePredictEnd: "2025-05-01T00:00:00Z",
      },
    });

    const results = await client.GET("/u/analysis/advanced-regression/result");

    expect(results.data!.records![0].rmse).toBeGreaterThan(3);
  });

  it("Create suggestion and send message to queue", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const produceSpy = vi
      .spyOn(ServiceMessageQueue, "produce")
      .mockResolvedValue(undefined);

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");

    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const suggest = await client.POST(
      "/u/analysis/advanced-regression/suggest",
      {
        params: {
          query: {
            datetimeMin: "2024-12-01T00:00:00Z",
            datetimeMax: "2025-05-01T00:00:00Z",
          },
        },
        body: { seuId },
      },
    );

    expect(suggest).toBeApiOk();

    expect(produceSpy).toHaveBeenCalledTimes(1);
    const buffer = produceSpy.mock.calls[0][1];
    const res = JSON.parse(buffer.toString());

    // This code block reorders metric ids and associated
    //   values to match test result
    const dataToOrder = [
      { id: driver1.id, values: [5, 10, 15] },
      { id: driver2.id, values: [5, 12, 17] },
      // TODO currently other counters are considered as driver
      // { id: resources.metricResourceId2, values: [18, 20, 25] },
    ].sort((a, b) => a.id.localeCompare(b.id));
    const orderedXValues: number[][] = [[], [], []];
    for (const metric of dataToOrder) {
      for (let i = 0; i < metric.values.length; i++) {
        orderedXValues[i].push(metric.values[i]);
      }
    }
    const orderedFeatureIds = dataToOrder.map((d) => d.id);

    expect(res).toStrictEqual({
      x: orderedXValues,
      feature_ids: orderedFeatureIds,
      y: [10, 12, 14],
      target_id: seuId,
    });

    const suggestions = await client.GET(
      "/u/analysis/advanced-regression/suggest",
    );

    expect(suggestions).toBeApiOk();
    expect(suggestions.data).toStrictEqual({
      records: [
        {
          id: suggestions.data!.records[0].id,
          createdAt: expect.any(String),
          datetimeEnd: expect.any(String),
          datetimeStart: expect.any(String),
          status: "PENDING",
          seu: {
            id: seuId,
            name: "Test SEU",
          },
          drivers: [],
          failInfo: null,
        },
      ],
    });

    produceSpy.mockRestore();
  });

  it("Commit advanced regression with slices.", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const resCommit = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          meterSliceIds: [meter1.sliceId, meter2.sliceId],
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2024-12-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2024-12-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );

    const resId = resCommit.data?.id;

    expect(resCommit).toBeApiOk();

    const resGet = await client.GET("/u/analysis/advanced-regression/result");

    expect(resGet).toBeApiOk();

    expect(resGet.data).toStrictEqual({
      records: [
        {
          id: resId,
          createdAt: expect.any(String),
          datePredictEnd: "2025-03-01T00:00:00.000Z",
          datePredictStart: "2024-12-01T00:00:00.000Z",
          dateTrainEnd: "2025-03-01T00:00:00.000Z",
          dateTrainStart: "2024-12-01T00:00:00.000Z",
          drivers: [
            {
              id: driver1.id,
              name: "driver1",
              unitGroup: "TEMPERATURE",
            },
            {
              id: driver2.id,
              name: "driver2",
              unitGroup: "TEMPERATURE",
            },
          ],
          period: "DAILY",
          primary: false,
          rSquared: 1,
          rmse: 0,
          seu: null,
          slices: [
            {
              id: meter1.sliceId,
              name: "Metric:meter1 - Department:meter1",
            },
            {
              id: meter2.sliceId,
              name: "Metric:meter2 - Department:meter2",
            },
          ],
          threshold: null,
          trainRecordIgnoredCount: 0,
        },
      ],
    });
  });

  it("Get suggestion", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const produceSpy = vi
      .spyOn(ServiceMessageQueue, "produce")
      .mockResolvedValue(undefined);

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");

    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const suggest = await client.POST(
      "/u/analysis/advanced-regression/suggest",
      {
        params: {
          query: {
            datetimeMin: "2025-01-01T00:00:00Z",
            datetimeMax: "2025-05-01T00:00:00Z",
          },
        },
        body: { seuId },
      },
    );

    expect(suggest).toBeApiOk();
    const suggestId = suggest.data!.ids[0];

    const suggestions = await client.GET(
      "/u/analysis/advanced-regression/suggest/{id}",
      { params: { path: { id: suggestId } } },
    );

    expect(suggestions).toBeApiOk();
    expect(suggestions.data).toStrictEqual({
      id: suggestId,
      createdAt: expect.any(String),
      datetimeEnd: expect.any(String),
      datetimeStart: expect.any(String),
      status: "PENDING",
      seu: {
        id: seuId,
        name: "Test SEU",
      },
      drivers: [],
      failInfo: null,
    });

    produceSpy.mockRestore();
  });

  it("Create suggestion without give id and send message to queue", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const produceSpy = vi
      .spyOn(ServiceMessageQueue, "produce")
      .mockResolvedValue(undefined);

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");

    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const suggest = await client.POST(
      "/u/analysis/advanced-regression/suggest",
      {
        params: {
          query: {
            datetimeMin: "2024-12-01T00:00:00Z",
            datetimeMax: "2025-05-01T00:00:00Z",
          },
        },
        body: {},
      },
    );

    expect(suggest).toBeApiOk();

    expect(produceSpy).toHaveBeenCalledTimes(1);
    const buffer = produceSpy.mock.calls[0][1];
    const res = JSON.parse(buffer.toString());

    // This code block reorders metric ids and associated
    //   values to match test result
    const dataToOrder = [
      { id: driver1.id, values: [5, 10, 15] },
      { id: driver2.id, values: [5, 12, 17] },
      // TODO currently other counters are considered as driver
      // { id: resources.metricResourceId2, values: [18, 20, 25] },
    ].sort((a, b) => a.id.localeCompare(b.id));
    const orderedXValues: number[][] = [[], [], []];
    for (const metric of dataToOrder) {
      for (let i = 0; i < metric.values.length; i++) {
        orderedXValues[i].push(metric.values[i]);
      }
    }
    const orderedFeatureIds = dataToOrder.map((d) => d.id);

    expect(res).toStrictEqual({
      x: orderedXValues,
      feature_ids: orderedFeatureIds,
      y: [10, 12, 14],
      target_id: seuId,
    });

    const suggestions = await client.GET(
      "/u/analysis/advanced-regression/suggest",
    );

    expect(suggestions).toBeApiOk();
    expect(suggestions.data).toStrictEqual({
      records: [
        {
          id: suggestions.data!.records[0].id,
          createdAt: expect.any(String),
          datetimeEnd: expect.any(String),
          datetimeStart: expect.any(String),
          status: "PENDING",
          seu: {
            id: seuId,
            name: "Test SEU",
          },
          drivers: [],
          failInfo: null,
        },
      ],
    });

    produceSpy.mockRestore();
  });

  it("Get advanced regression result with source values (includeSources=true)", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const commitRes = await client.POST(
      "/u/analysis/advanced-regression/commit",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2025-01-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2025-01-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(commitRes).toBeApiOk();
    const resultId = commitRes.data!.id;

    const res = await client.GET(
      "/u/analysis/advanced-regression/result/{resultId}",
      {
        params: {
          path: { resultId },
          query: { includeSources: "true" },
        },
      },
    );
    expect(res).toBeApiOk();

    const result = res.data!;

    expect(result.sourceMeterSlices).toStrictEqual(
      expect.arrayContaining([
        {
          id: meter1.sliceId,
          values: [
            { datetime: "2025-02-01T00:00:00.000Z", value: 12 },
            { datetime: "2025-03-01T00:00:00.000Z", value: 14 },
          ],
        },
        {
          id: meter2.sliceId,
          values: [
            { datetime: "2025-02-01T00:00:00.000Z", value: 20 },
            { datetime: "2025-03-01T00:00:00.000Z", value: 25 },
          ],
        },
      ]),
    );

    expect(result.sourceDrivers).toStrictEqual(
      expect.arrayContaining([
        {
          id: driver1.id,
          values: [
            { datetime: "2025-01-01T00:00:00.000Z", value: 5 },
            { datetime: "2025-02-01T00:00:00.000Z", value: 10 },
            { datetime: "2025-03-01T00:00:00.000Z", value: 15 },
          ],
        },
        {
          id: driver2.id,
          values: [
            {
              datetime: "2025-01-01T00:00:00.000Z",
              value: 5,
            },
            { datetime: "2025-02-01T00:00:00.000Z", value: 12 },
            { datetime: "2025-03-01T00:00:00.000Z", value: 17 },
          ],
        },
      ]),
    );
  });

  it("Delete suggestion and send message to queue", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();

    const produceSpy = vi
      .spyOn(ServiceMessageQueue, "produce")
      .mockResolvedValue(undefined);

    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");

    const driver1 = await TestHelperMetric.create(client, "driver1");
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const suggest = await client.POST(
      "/u/analysis/advanced-regression/suggest",
      {
        params: { query: TestHelperMetric.getFullDatetimeRangeQuery() },
        body: { seuId },
      },
    );

    expect(suggest).toBeApiOk();

    // Before delete
    {
      const suggestions = await client.GET(
        "/u/analysis/advanced-regression/suggest",
      );
      expect(suggestions).toBeApiOk();
      expect(suggestions.data).toStrictEqual({
        records: [
          {
            id: suggestions.data!.records[0].id,
            createdAt: expect.any(String),
            datetimeEnd: expect.any(String),
            datetimeStart: expect.any(String),
            status: "PENDING",
            seu: {
              id: seuId,
              name: "Test SEU",
            },
            drivers: [],
            failInfo: null,
          },
        ],
      });
    }

    const resDelete = await client.DELETE(
      "/u/analysis/advanced-regression/suggest/{id}",
      { params: { path: { id: suggest.data!.ids[0] } } },
    );
    expect(resDelete).toBeApiOk();

    // After delete
    {
      const suggestions = await client.GET(
        "/u/analysis/advanced-regression/suggest",
      );
      expect(suggestions).toBeApiOk();
      expect(suggestions.data).toStrictEqual({
        records: [],
      });
    }

    produceSpy.mockRestore();
  });

  it("Throw error when using ENERGY metric", async () => {
    const { client, session } = await UtilTest.createClientLoggedIn();
    const departmentId = await TestHelperDepartment.create(
      client,
      "Test Department",
    );

    const meter1 = await TestHelperMeter.create(client, "meter1");
    const meter2 = await TestHelperMeter.create(client, "meter2");
    const driver1 = await TestHelperMetric.create(client, "driver1", {
      unitGroup: "ENERGY",
    });
    const driver2 = await TestHelperMetric.create(client, "driver2");

    const seu = await client.POST("/u/measurement/seu/item", {
      body: {
        name: "Test SEU",
        departmentIds: [departmentId],
        energyResource: "ELECTRIC",
        meterSliceIds: [meter1.sliceId, meter2.sliceId],
      },
    });
    expect(seu).toBeApiOk();
    const seuId = seu.data!.id;

    await addValue(
      session.orgId,
      meter1.metricId,
      meter2.metricId,
      driver1.id,
      driver2.id,
    );

    const regressionResult = await client.POST(
      "/u/analysis/advanced-regression/run",
      {
        body: {
          seuId,
          driverIds: [driver1.id, driver2.id],
          dateTrainStart: "2024-12-01T00:00:00Z",
          dateTrainEnd: "2025-03-01T00:00:00Z",
          datePredictStart: "2024-12-01T00:00:00Z",
          datePredictEnd: "2025-03-01T00:00:00Z",
        },
      },
    );
    expect(regressionResult).toBeApiError(EApiFailCode.BAD_REQUEST);
  });
});
