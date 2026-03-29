import { EApiFailCode, IUnitGroup } from "common";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { sampleCorrelation } from "simple-statistics";

import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextCore,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { UtilDb } from "@m/core/utils/UtilDb";
import { IMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";
import { UtilMetricResourceValuePeriod } from "@m/measurement/utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "@m/measurement/utils/UtilMetricValueQuery";
import { UtilTimedSeries } from "@m/measurement/utils/UtilTimedSeries";

import { ICorrelationResultValue } from "../interfaces/ICorrelationResultValue";
import { TbCorrelationResult } from "../orm/TbCorrelationResult";
import { TbCorrelationResultValue } from "../orm/TbCorrelationResultValue";

export namespace ServiceCorrelation {
  export async function calculate(
    c: IContextOrg,
    params: {
      metricIds: string[];
      datetimeStart: string;
      datetimeEnd: string;
    },
  ) {
    // Fetch raw metric values from database
    // -----------------------------------------------------------------------
    // const period = ANALYSIS_PERIOD;
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      params.datetimeStart,
      params.datetimeEnd,
    );
    const tableUnionMetric =
      UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
        c,
        params.metricIds,
        period,
        [params.datetimeStart, params.datetimeEnd],
      );

    const metricData = await c.db
      .with(tableUnionMetric)
      .select({
        metricId: tableUnionMetric.metricId,
        values: UtilDb.jsonAgg(
          {
            // Null values are filtered at where section
            value: sql<number>`${tableUnionMetric.value}`,
            datetime: UtilDb.isoDatetime(tableUnionMetric.bucket),
          },
          { orderBy: tableUnionMetric.bucket },
        ),
      })
      .from(tableUnionMetric)
      .where(isNotNull(tableUnionMetric.value))
      .groupBy(tableUnionMetric.metricId);

    // Check if metric data exists
    // -----------------------------------------------------------------------
    if (!metricData.length) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Metric data is insufficient or unavailable.",
      );
    }

    // Map values by metric id
    // -----------------------------------------------------------------------
    const metricMap = new Map<string, ITimedValue[]>();
    for (const { metricId, values } of metricData) {
      metricMap.set(metricId, values);
    }

    // Check if we have enough metrics with valid data
    // -----------------------------------------------------------------------
    if (metricMap.size < 2) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Insufficient metrics with valid data. At least 2 metrics are required for correlation analysis.",
      );
    }

    // Compute pairwise sample correlations
    // -----------------------------------------------------------------------
    const correlations: ICorrelationResultValue[] = [];
    const metricIdsArr = Array.from(metricMap.keys());

    for (let i = 0; i < metricIdsArr.length; ++i) {
      const metricAId = metricIdsArr[i];
      const serieA = metricMap.get(metricAId)!;
      for (let j = i + 1; j < metricIdsArr.length; ++j) {
        const metricBId = metricIdsArr[j];
        const serieB = metricMap.get(metricBId)!;

        // Normalize values
        // -------------------------------------------------------------------
        const {
          series: [normalizedValuesA, normalizedValuesB],
          // interpolateRate,
          // interpolatedRecordCount,
        } = UtilTimedSeries.normalizeSeries([serieA, serieB]);

        // Calculate correlation if sufficient data
        // At least 2 data points are required for correlation
        // -------------------------------------------------------------------
        if (normalizedValuesA.length < 2) {
          c.logger.warn(
            {
              metricAId,
              metricBId,
              normalizedLength: normalizedValuesA.length,
            },
            "Insufficient normalized data for correlation calculation. Skipping pair.",
          );
          continue;
        }

        const corr = sampleCorrelation(
          normalizedValuesA.map((d) => d.value),
          normalizedValuesB.map((d) => d.value),
        );

        correlations.push({
          metricAId,
          metricBId,
          value: corr,
          recordCount: normalizedValuesA.length * 2, // value count A + B
          // interpolatedRecordCount,
          // interpolateRate,
        });
      }
    }

    // Check if any correlations were calculated
    // -----------------------------------------------------------------------
    if (correlations.length === 0) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Unable to calculate correlations. Insufficient overlapping data between metrics after normalization.",
      );
    }

    return {
      period,
      correlations,
    };
  }

  export async function saveResults(
    c: IContextCore,
    params: {
      orgId: string;
      userId: string;
      datetimeStart: string;
      datetimeEnd: string;
      period: IMetricResourceValuePeriod;
      metrics: {
        id: string;
        name: string;
        unitGroup: IUnitGroup;
      }[];
      correlations: ICorrelationResultValue[];
    },
  ) {
    // Persist correlation results within a transaction
    // -----------------------------------------------------------------------
    await c.db.transaction(async (tx) => {
      // Insert main result record
      const [insertedResult] = await tx
        .insert(TbCorrelationResult)
        .values({
          orgId: params.orgId,
          metrics: params.metrics,
          datetimeStart: params.datetimeStart,
          datetimeEnd: params.datetimeEnd,
          period: params.period,
          createdBy: params.userId,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbCorrelationResult.id });

      // Insert individual correlation values if any
      if (params.correlations.length > 0) {
        await tx.insert(TbCorrelationResultValue).values(
          params.correlations.map(
            ({
              metricAId,
              metricBId,
              value,
              recordCount,
              // interpolatedRecordCount,
              // interpolateRate,
            }) => ({
              orgId: params.orgId,
              subjectId: insertedResult.id,
              metricAId,
              metricBId,
              value,
              recordCount,
              // interpolatedRecordCount,
              // interpolateRate,
            }),
          ),
        );
      }

      c.logger.info(
        {
          resultCount: params.correlations.length,
          resultId: insertedResult.id,
        },
        "Correlation results successfully.",
      );
    });
  }

  export async function removeResult(c: IContextUser, resultId: string) {
    // Delete correlation result and its values
    // -----------------------------------------------------------------------
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbCorrelationResultValue)
        .where(
          and(
            eq(TbCorrelationResultValue.subjectId, resultId),
            eq(TbCorrelationResultValue.orgId, c.session.orgId),
          ),
        );
      await tx
        .delete(TbCorrelationResult)
        .where(
          and(
            eq(TbCorrelationResult.id, resultId),
            eq(TbCorrelationResult.orgId, c.session.orgId),
          ),
        );
    });
  }

  export async function getAllResults(c: IContextUser) {
    // Retrieve all historical correlation results
    // -----------------------------------------------------------------------
    const results = await c.db
      .select({
        id: TbCorrelationResult.id,
        metrics: TbCorrelationResult.metrics,
        datetimeStart: UtilDb.isoDatetime(TbCorrelationResult.datetimeStart),
        datetimeEnd: UtilDb.isoDatetime(TbCorrelationResult.datetimeEnd),
        period: TbCorrelationResult.period,
        createdAt: UtilDb.isoDatetime(TbCorrelationResult.createdAt),
      })
      .from(TbCorrelationResult)
      .where(eq(TbCorrelationResult.orgId, c.session.orgId))
      .orderBy(desc(TbCorrelationResult.createdAt));

    return results;
  }

  export async function getResult(c: IContextUser, resultId: string) {
    // Retrieve a single correlation result and its values
    // -----------------------------------------------------------------------
    const [result] = await c.db
      .select({
        id: TbCorrelationResult.id,
        metrics: TbCorrelationResult.metrics,
        datetimeStart: UtilDb.isoDatetime(TbCorrelationResult.datetimeStart),
        datetimeEnd: UtilDb.isoDatetime(TbCorrelationResult.datetimeEnd),
        period: TbCorrelationResult.period,
        createdAt: UtilDb.isoDatetime(TbCorrelationResult.createdAt),
      })
      .from(TbCorrelationResult)
      .where(
        and(
          eq(TbCorrelationResult.id, resultId),
          eq(TbCorrelationResult.orgId, c.session.orgId),
        ),
      );

    if (!result) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    const values = await c.db
      .select({
        metricAId: TbCorrelationResultValue.metricAId,
        metricBId: TbCorrelationResultValue.metricBId,
        value: TbCorrelationResultValue.value,
        recordCount: TbCorrelationResultValue.recordCount,
        // interpolatedRecordCount:
        //   TbCorrelationResultValue.interpolatedRecordCount,
        // interpolateRate: TbCorrelationResultValue.interpolateRate,
      })
      .from(TbCorrelationResultValue)
      .where(
        and(
          eq(TbCorrelationResultValue.subjectId, resultId),
          eq(TbCorrelationResultValue.orgId, c.session.orgId),
        ),
      );

    return {
      ...result,
      values,
    };
  }
}
