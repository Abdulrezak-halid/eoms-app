import { EApiFailCode, UtilDate } from "common";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import { UtilTest } from "@/test/utils/UtilTest";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { TbMetric } from "@m/measurement/orm/TbMetric";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";
import { TestHelperMetric } from "@m/measurement/test/TestHelperMetric";

import { TbCorrelationResult } from "../orm/TbCorrelationResult";
import { TbCorrelationResultValue } from "../orm/TbCorrelationResultValue";
import { ServiceCorrelation } from "../services/ServiceCorrelation";

describe("ServiceMetricCorrelation", () => {
  let orgId: string;
  let userId: string;

  let contextC: IContextCore;
  let contextU: IContextUser;

  beforeEach(async () => {
    contextC = UtilTest.createTestContext();
    contextU = await UtilTest.createTestContextUser();

    orgId = contextU.session.orgId;
    userId = contextU.session.userId;
  });

  // DEPRECATD
  // it("Should calculate correlations truncating and interpolating missing values", async () => {
  //   const metricId1 = "00000000-0000-0000-0000-000000000001";
  //   const metricId2 = "00000000-0000-0000-0000-000000000002";
  //   const metricId3 = "00000000-0000-0000-0000-000000000003";

  //   const nowDatetime = UtilDate.getNowUtcIsoDate();

  //   await contextC.db.insert(TbMetric).values([
  //     {
  //       id: metricId1,
  //       orgId,
  //       createdBy: userId,
  //       name: "Metric 1",
  //       type: "GAUGE",
  //       description: "Test Metric 1",
  //       unitGroup: "WEIGHT",
  //       createdAt: nowDatetime,
  //     },
  //     {
  //       id: metricId2,
  //       orgId,
  //       createdBy: userId,
  //       name: "Metric 2",
  //       type: "GAUGE",
  //       description: "Test Metric 2",
  //       unitGroup: "WEIGHT",
  //       createdAt: nowDatetime,
  //     },
  //     {
  //       id: metricId3,
  //       orgId,
  //       createdBy: userId,
  //       name: "Metric 3",
  //       type: "GAUGE",
  //       description: "Test Metric 3",
  //       unitGroup: "WEIGHT",
  //       createdAt: nowDatetime,
  //     },
  //   ]);

  //   await TestHelperMetric.addValues(orgId, metricId1, [
  //     { value: 3.4, datetime: "2025-01-01T00:00:00Z" },
  //     { value: 15, datetime: "2025-01-02T00:00:00Z" },
  //     { value: 5, datetime: "2025-01-03T00:00:00Z" },
  //   ]);

  //   await TestHelperMetric.addValues(orgId, metricId2, [
  //     { value: 7.8, datetime: "2025-01-01T00:00:00Z" },
  //     { value: 5, datetime: "2025-01-03T00:00:00Z" },
  //     { value: 2.3, datetime: "2025-01-04T00:00:00Z" },
  //   ]);

  //   await TestHelperMetric.addValues(orgId, metricId3, [
  //     { value: 17.8, datetime: "2025-01-01T00:00:00Z" },
  //     { value: 2.8, datetime: "2025-01-02T00:00:00Z" },
  //     { value: 12.3, datetime: "2025-01-04T00:00:00Z" },
  //   ]);

  //   const datetimeStart = "2025-01-01T00:00:00Z";
  //   const datetimeEnd = "2025-01-08T00:00:00Z";
  //   const result = await ServiceCorrelation.calculate(contextU, {
  //     metricIds: [metricId1, metricId2, metricId3],
  //     datetimeStart,
  //     datetimeEnd,
  //   });

  //   expect(result).toStrictEqual({
  //     period: "HOURLY",
  //     correlations: [
  //       {
  //         metricAId: metricId1,
  //         metricBId: metricId2,
  //         value: -0.12725695259515543,
  //         recordCount: 6,
  //         // interpolatedRecordCount: 1,
  //         // interpolateRate: 0.16666666666666666,
  //       },
  //       {
  //         metricAId: metricId1,
  //         metricBId: metricId3,
  //         value: -1,
  //         recordCount: 4,
  //         // interpolatedRecordCount: 0,
  //         // interpolateRate: 0,
  //       },
  //       {
  //         metricAId: metricId2,
  //         metricBId: metricId3,
  //         value: 0.1189065005601511,
  //         recordCount: 8,
  //         // interpolatedRecordCount: 2,
  //         // interpolateRate: 0.25,
  //       },
  //     ],
  //   });
  // });

  it("Should calculate correlations truncating missing values", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000001";
    const metricId2 = "00000000-0000-0000-0000-000000000002";
    const metricId3 = "00000000-0000-0000-0000-000000000003";

    const nowDatetime = UtilDate.getNowUtcIsoDate();

    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "GAUGE",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "GAUGE",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId3,
        orgId,
        createdBy: userId,
        name: "Metric 3",
        type: "GAUGE",
        description: "Test Metric 3",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    await TestHelperMetric.addValues(orgId, metricId1, [
      { value: 3, datetime: "2025-01-01T00:00:00Z" },
      { value: 15, datetime: "2025-01-02T00:00:00Z" },
      { value: 5, datetime: "2025-01-03T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(orgId, metricId2, [
      { value: 8, datetime: "2025-01-01T00:00:00Z" },
      { value: 6, datetime: "2025-01-02T00:00:00Z" },
      { value: 5, datetime: "2025-01-03T00:00:00Z" },
      { value: 3, datetime: "2025-01-04T00:00:00Z" },
    ]);

    await TestHelperMetric.addValues(orgId, metricId3, [
      { value: 18, datetime: "2025-01-01T00:00:00Z" },
      { value: 3, datetime: "2025-01-02T00:00:00Z" },
      { value: 6, datetime: "2025-01-03T00:00:00Z" },
      { value: 12, datetime: "2025-01-04T00:00:00Z" },
    ]);

    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";
    const result = await ServiceCorrelation.calculate(contextU, {
      metricIds: [metricId1, metricId2, metricId3],
      datetimeStart,
      datetimeEnd,
    });

    expect(result).toStrictEqual({
      period: "HOURLY",
      correlations: [
        {
          metricAId: metricId1,
          metricBId: metricId2,
          value: -0.3394221166510653,
          recordCount: 6,
          // interpolatedRecordCount: 1,
          // interpolateRate: 0.16666666666666666,
        },
        {
          metricAId: metricId1,
          metricBId: metricId3,
          value: -0.7642652566278799,
          recordCount: 6,
          // interpolatedRecordCount: 0,
          // interpolateRate: 0,
        },
        {
          metricAId: metricId2,
          metricBId: metricId3,
          value: 0.3249711651033535,
          recordCount: 8,
          // interpolatedRecordCount: 2,
          // interpolateRate: 0.25,
        },
      ],
    });
  });

  it("Should save correlation results", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000003";
    const metricId2 = "00000000-0000-0000-0000-000000000004";
    const metricId3 = "00000000-0000-0000-0000-000000000005";
    const nowDatetime = UtilDate.getNowUtcIsoDate();
    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";

    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "COUNTER",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "COUNTER",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId3,
        orgId,
        createdBy: userId,
        name: "Metric 3",
        type: "COUNTER",
        description: "Test Metric 3",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    const correlations = [
      {
        metricAId: metricId1,
        metricBId: metricId2,
        value: -0.13766131,
        recordCount: 10,
        // interpolatedRecordCount: 0,
        // interpolateRate: 0,
      },
      {
        metricAId: metricId1,
        metricBId: metricId3,
        value: -1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
      {
        metricAId: metricId2,
        metricBId: metricId3,
        value: 1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
    ];

    const metrics = await ServiceMetric.getNames(contextU, {
      ids: [metricId1, metricId2, metricId3],
    });

    await ServiceCorrelation.saveResults(contextC, {
      orgId,
      userId,
      datetimeStart,
      datetimeEnd,
      period: "DAILY",
      metrics: metrics.map((d) => ({
        id: d.id,
        name: d.name,
        unitGroup: d.unitGroup,
      })),
      correlations,
    });

    const correlationResults = await contextC.db
      .select()
      .from(TbCorrelationResult)
      .where(eq(TbCorrelationResult.orgId, orgId));

    expect(correlationResults).toHaveLength(1);
    const correlationResultId = correlationResults[0].id;

    const correlationValues = await contextC.db
      .select()
      .from(TbCorrelationResultValue)
      .where(eq(TbCorrelationResultValue.subjectId, correlationResultId));

    expect(correlationValues).toHaveLength(3);

    expect(correlationValues).toStrictEqual([
      {
        recordCount: 10,
        // interpolatedRecordCount: 0,
        // interpolateRate: 0,
        metricAId: metricId1,
        metricBId: metricId2,
        id: expect.any(String),
        orgId,
        subjectId: expect.any(String),
        value: -0.13766131,
      },
      {
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
        metricAId: metricId1,
        metricBId: metricId3,
        id: expect.any(String),
        orgId,
        subjectId: expect.any(String),
        value: -1,
      },
      {
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
        metricAId: metricId2,
        metricBId: metricId3,
        id: expect.any(String),
        orgId,
        subjectId: expect.any(String),
        value: 1,
      },
    ]);
  });

  it("Should remove correlation results", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000003";
    const metricId2 = "00000000-0000-0000-0000-000000000004";
    const metricId3 = "00000000-0000-0000-0000-000000000005";
    const nowDatetime = UtilDate.getNowUtcIsoDate();
    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";
    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "COUNTER",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "COUNTER",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId3,
        orgId,
        createdBy: userId,
        name: "Metric 3",
        type: "COUNTER",
        description: "Test Metric 3",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    const correlations = [
      {
        metricAId: metricId1,
        metricBId: metricId2,
        value: -0.13766131,
        recordCount: 10,
        // interpolatedRecordCount: 0,
        // interpolateRate: 0,
      },
      {
        metricAId: metricId1,
        metricBId: metricId3,
        value: -1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
      {
        metricAId: metricId2,
        metricBId: metricId3,
        value: 1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
    ];

    const metrics = await ServiceMetric.getNames(contextU, {
      ids: [metricId1, metricId2, metricId3],
    });

    await ServiceCorrelation.saveResults(contextC, {
      orgId,
      userId,
      datetimeStart,
      datetimeEnd,
      period: "DAILY",
      metrics: metrics.map((d) => ({
        id: d.id,
        name: d.name,
        unitGroup: d.unitGroup,
      })),
      correlations,
    });

    const correlationResults = await ServiceCorrelation.getAllResults(contextU);
    expect(correlationResults).toHaveLength(1);
    const correlationResultId = correlationResults[0].id;

    await ServiceCorrelation.removeResult(contextU, correlationResultId);

    await expect(
      ServiceCorrelation.getResult(contextU, correlationResultId),
    ).rejects.toThrowError(new ApiException(EApiFailCode.NOT_FOUND));
  });

  it("Should get correlation results", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000003";
    const metricId2 = "00000000-0000-0000-0000-000000000004";
    const metricId3 = "00000000-0000-0000-0000-000000000005";
    const nowDatetime = UtilDate.getNowUtcIsoDate();
    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";
    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "COUNTER",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "COUNTER",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId3,
        orgId,
        createdBy: userId,
        name: "Metric 3",
        type: "COUNTER",
        description: "Test Metric 3",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    const correlations = [
      {
        metricAId: metricId1,
        metricBId: metricId2,
        value: -0.13766131,
        recordCount: 10,
        // interpolatedRecordCount: 0,
        // interpolateRate: 0,
      },
      {
        metricAId: metricId1,
        metricBId: metricId3,
        value: -1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
      {
        metricAId: metricId2,
        metricBId: metricId3,
        value: 1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
    ];

    const metrics = await ServiceMetric.getNames(contextU, {
      ids: [metricId1, metricId2, metricId3],
    });

    await ServiceCorrelation.saveResults(contextC, {
      orgId,
      userId,
      datetimeStart,
      datetimeEnd,
      period: "DAILY",
      metrics: metrics.map((d) => ({
        id: d.id,
        name: d.name,
        unitGroup: d.unitGroup,
      })),
      correlations,
    });

    const correlationResults = await ServiceCorrelation.getAllResults(contextU);
    expect(correlationResults).toHaveLength(1);
    const correlationResultId = correlationResults[0].id;
    const correlationResultCreatedAt = correlationResults[0].createdAt;

    const result = await ServiceCorrelation.getResult(
      contextU,
      correlationResultId,
    );

    expect(result).toStrictEqual({
      createdAt: correlationResultCreatedAt,
      id: correlationResultId,
      metrics: [
        {
          id: metricId1,
          name: "Metric 1",
          unitGroup: "WEIGHT",
        },
        {
          id: metricId2,
          name: "Metric 2",
          unitGroup: "WEIGHT",
        },
        {
          id: metricId3,
          name: "Metric 3",
          unitGroup: "WEIGHT",
        },
      ],
      datetimeEnd: "2025-01-08T00:00:00.000Z",
      datetimeStart: "2025-01-01T00:00:00.000Z",
      period: "DAILY",
      values: [
        {
          metricAId: metricId1,
          metricBId: metricId2,
          value: -0.13766131,
          recordCount: 10,
          // interpolatedRecordCount: 0,
          // interpolateRate: 0,
        },
        {
          metricAId: metricId1,
          metricBId: metricId3,
          value: -1,
          recordCount: 10,
          // interpolatedRecordCount: 4,
          // interpolateRate: 0.4,
        },
        {
          metricAId: metricId2,
          metricBId: metricId3,
          value: 1,
          recordCount: 10,
          // interpolatedRecordCount: 4,
          // interpolateRate: 0.4,
        },
      ],
    });
  });

  it("Should getAll correlation results", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000003";
    const metricId2 = "00000000-0000-0000-0000-000000000004";
    const metricId3 = "00000000-0000-0000-0000-000000000005";
    const nowDatetime = UtilDate.getNowUtcIsoDate();
    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";
    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "COUNTER",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "COUNTER",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId3,
        orgId,
        createdBy: userId,
        name: "Metric 3",
        type: "COUNTER",
        description: "Test Metric 3",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    const correlations = [
      {
        metricAId: metricId1,
        metricBId: metricId2,
        value: -0.13766131,
        recordCount: 10,
        // interpolatedRecordCount: 0,
        // interpolateRate: 0,
      },
      {
        metricAId: metricId1,
        metricBId: metricId3,
        value: -1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
      {
        metricAId: metricId2,
        metricBId: metricId3,
        value: 1,
        recordCount: 10,
        // interpolatedRecordCount: 4,
        // interpolateRate: 0.4,
      },
    ];

    const metrics = await ServiceMetric.getNames(contextU, {
      ids: [metricId1, metricId2, metricId3],
    });

    await ServiceCorrelation.saveResults(contextC, {
      orgId,
      userId,
      datetimeStart,
      datetimeEnd,
      period: "DAILY",
      metrics: metrics.map((d) => ({
        id: d.id,
        name: d.name,
        unitGroup: d.unitGroup,
      })),
      correlations,
    });

    const correlationResults = await ServiceCorrelation.getAllResults(contextU);
    expect(correlationResults).toHaveLength(1);
    const correlationResultId = correlationResults[0].id;
    const correlationResultCreatedAt = correlationResults[0].createdAt;

    const result = await ServiceCorrelation.getAllResults(contextU);

    expect(result).toStrictEqual([
      {
        createdAt: correlationResultCreatedAt,
        id: correlationResultId,
        metrics: [
          {
            id: metricId1,
            name: "Metric 1",
            unitGroup: "WEIGHT",
          },
          {
            id: metricId2,
            name: "Metric 2",
            unitGroup: "WEIGHT",
          },
          {
            id: metricId3,
            name: "Metric 3",
            unitGroup: "WEIGHT",
          },
        ],
        datetimeEnd: "2025-01-08T00:00:00.000Z",
        datetimeStart: "2025-01-01T00:00:00.000Z",
        period: "DAILY",
      },
    ]);
  });

  it("Should throw error when no metric data exists", async () => {
    const metricId1 = "00000000-0000-0000-0000-000000000010";
    const metricId2 = "00000000-0000-0000-0000-000000000011";
    const nowDatetime = UtilDate.getNowUtcIsoDate();

    await contextC.db.insert(TbMetric).values([
      {
        id: metricId1,
        orgId,
        createdBy: userId,
        name: "Metric 1",
        type: "COUNTER",
        description: "Test Metric 1",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
      {
        id: metricId2,
        orgId,
        createdBy: userId,
        name: "Metric 2",
        type: "COUNTER",
        description: "Test Metric 2",
        unitGroup: "WEIGHT",
        createdAt: nowDatetime,
      },
    ]);

    const datetimeStart = "2025-01-01T00:00:00Z";
    const datetimeEnd = "2025-01-08T00:00:00Z";

    await expect(
      ServiceCorrelation.calculate(contextU, {
        metricIds: [metricId1, metricId2],
        datetimeStart,
        datetimeEnd,
      }),
    ).rejects.toThrowError(
      new ApiException(
        EApiFailCode.NOT_FOUND,
        "Metric data is insufficient or unavailable.",
      ),
    );
  });
});
