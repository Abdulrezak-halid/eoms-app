import { EApiFailCode, IUnitGroup } from "common";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import {
  linearRegression,
  linearRegressionLine,
  rSquared,
} from "simple-statistics";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextCore,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilMetricResourceValuePeriod } from "@m/measurement/utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "@m/measurement/utils/UtilMetricValueQuery";
import { UtilTimedSeries } from "@m/measurement/utils/UtilTimedSeries";

import {
  IRegressionResult,
  IRegressionResultDataPoint,
} from "../interfaces/ILinearRegressionResult";
import { INamedRecord } from "../interfaces/INameList";
import { TbLinearRegressionResult } from "../orm/TbLinearRegressionResult";
import { TbLinearRegressionResultDataPoint } from "../orm/TbLinearRegressionResultDataPoint";

export namespace ServiceLinearRegression {
  export async function calculate(
    c: IContextOrg,
    params: {
      meterSliceIds: string[];
      driverId: string;
      datetimeStart: string;
      datetimeEnd: string;
    },
  ): Promise<IRegressionResult> {
    // Fetch aggregated slice values (value * rate)
    // -----------------------------------------------------------------------
    // const period = ANALYSIS_PERIOD;
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      params.datetimeStart,
      params.datetimeEnd,
    );

    const tableCounterDeltaMetric =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterSliceAgg(
        c,
        params.meterSliceIds,
        period,
        [params.datetimeStart, params.datetimeEnd],
      );

    const sliceData = await c.db
      .with(tableCounterDeltaMetric)
      .select({
        // Null values are filtered at where section
        value: sql<number>`sum(${tableCounterDeltaMetric.value})`,
        datetime: UtilDb.isoDatetime(tableCounterDeltaMetric.bucket),
      })
      .from(tableCounterDeltaMetric)
      .where(isNotNull(tableCounterDeltaMetric.value))
      .groupBy(tableCounterDeltaMetric.bucket)
      .orderBy(tableCounterDeltaMetric.bucket);

    // Fetch driver values
    // -----------------------------------------------------------------------
    const tableUnionMetric =
      UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
        c,
        [params.driverId],
        period,
        [params.datetimeStart, params.datetimeEnd],
      );

    const driverData = await c.db
      .with(tableUnionMetric)
      .select({
        // Null values are filtered at where section
        value: sql<number>`${tableUnionMetric.value}`,
        datetime: UtilDb.isoDatetime(tableUnionMetric.bucket),
      })
      .from(tableUnionMetric)
      .where(isNotNull(tableUnionMetric.value))
      .orderBy(tableUnionMetric.bucket);

    // Normalize (Truncate and Interpolate) slice and driver data
    // -----------------------------------------------------------------------
    const serieSlice: ITimedValue[] = sliceData;
    const serieDriver: ITimedValue[] = driverData;

    const normalizeSerieResult = UtilTimedSeries.normalizeSeries([
      serieSlice,
      serieDriver,
    ]);
    const [normalizedSerieSlice, normalizedSerieDriver] =
      normalizeSerieResult.series;
    const ignoredRecordCount = normalizeSerieResult.truncatedRecordCount;

    if (normalizedSerieSlice.length < 3) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Slice data is insufficient or unavailable.",
      );
    }

    if (normalizedSerieDriver.length < 3) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Driver data is insufficient or unavailable.",
      );
    }

    // Prepare regression data points where both axes have non-null values
    // -----------------------------------------------------------------------
    const dataPoints: IRegressionResultDataPoint[] = [];

    for (let i = 0; i < normalizedSerieSlice.length; ++i) {
      dataPoints.push({
        x: normalizedSerieSlice[i].value,
        y: normalizedSerieDriver[i].value,
      });
    }

    // Need at least two points to perform regression
    // -----------------------------------------------------------------------
    if (dataPoints.length < 2) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Data points is insufficient or unavailable.",
      );
    }

    // Sort points by independent variable and compute regression
    // -----------------------------------------------------------------------
    dataPoints.sort((a, b) => a.x - b.x);
    const dataPointsArr = dataPoints.map(({ x, y }) => [x, y]);
    const regression = linearRegression(dataPointsArr);
    const regressionLine = linearRegressionLine(regression);
    const r2 = rSquared(dataPointsArr, regressionLine);

    return {
      period,
      slope: regression.m,
      intercept: regression.b,
      rSquared: r2,
      ignoredRecordCount,
      // interpolateRate: normalizeSerieResult.interpolateRate,
      // interpolatedRecordCount: normalizeSerieResult.interpolatedRecordCount,
      dataPoints,
    };
  }

  // Persist regression result and its data points within a database transaction.
  // -----------------------------------------------------------------------
  export async function saveResults(
    c: IContextCore,
    params: {
      energyResource: IEnergyResource;
      meterSlices: INamedRecord[];
      driver: { id: string; name: string; unitGroup: IUnitGroup };
      datetimeStart: string;
      datetimeEnd: string;
      result: IRegressionResult;
      userId: string;
      orgId: string;
    },
  ) {
    await c.db.transaction(async (tx) => {
      // Insert summary record and retrieve its id
      // -----------------------------------------------------------------------
      const [insertedResult] = await tx
        .insert(TbLinearRegressionResult)
        .values({
          orgId: params.orgId,
          energyResource: params.energyResource,
          meterSlices: params.meterSlices,
          driver: params.driver,
          datetimeStart: params.datetimeStart,
          datetimeEnd: params.datetimeEnd,
          period: params.result.period,
          slope: params.result.slope,
          intercept: params.result.intercept,
          rSquared: params.result.rSquared,
          ignoredRecordCount: params.result.ignoredRecordCount,
          // interpolateRate: params.result.interpolateRate,
          // interpolatedRecordCount: params.result.interpolatedRecordCount,
          createdBy: params.userId,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbLinearRegressionResult.id });

      // Bulk insert each regression data point
      // -----------------------------------------------------------------------
      await tx.insert(TbLinearRegressionResultDataPoint).values(
        params.result.dataPoints.map(({ x, y }) => ({
          orgId: params.orgId,
          resultId: insertedResult.id,
          x,
          y,
        })),
      );

      c.logger.info(
        {
          resultId: insertedResult.id,
          dataPointCount: params.result.dataPoints.length,
        },
        "Linear regression results saved successfully.",
      );
    });
  }

  // Delete a saved regression result and its points for the current user/organization.
  // -----------------------------------------------------------------------
  export async function removeResult(c: IContextUser, resultId: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbLinearRegressionResultDataPoint)
        .where(
          and(
            eq(TbLinearRegressionResultDataPoint.resultId, resultId),
            eq(TbLinearRegressionResultDataPoint.orgId, c.session.orgId),
          ),
        );
      await tx
        .delete(TbLinearRegressionResult)
        .where(
          and(
            eq(TbLinearRegressionResult.id, resultId),
            eq(TbLinearRegressionResult.orgId, c.session.orgId),
          ),
        );
    });
  }

  // Retrieve all regression results for the current organization, ordered by creation date.
  // -----------------------------------------------------------------------
  export async function getAllResults(c: IContextUser) {
    const results = await c.db
      .select({
        id: TbLinearRegressionResult.id,
        energyResource: TbLinearRegressionResult.energyResource,
        meterSlices: TbLinearRegressionResult.meterSlices,
        driver: TbLinearRegressionResult.driver,
        slope: TbLinearRegressionResult.slope,
        intercept: TbLinearRegressionResult.intercept,
        rSquared: TbLinearRegressionResult.rSquared,
        ignoredRecordCount: TbLinearRegressionResult.ignoredRecordCount,
        // interpolateRate: TbLinearRegressionResult.interpolateRate,
        // interpolatedRecordCount:
        //   TbLinearRegressionResult.interpolatedRecordCount,
        datetimeStart: UtilDb.isoDatetime(
          TbLinearRegressionResult.datetimeStart,
        ),
        datetimeEnd: UtilDb.isoDatetime(TbLinearRegressionResult.datetimeEnd),
        period: TbLinearRegressionResult.period,
        createdAt: UtilDb.isoDatetime(TbLinearRegressionResult.createdAt),
      })
      .from(TbLinearRegressionResult)
      .where(eq(TbLinearRegressionResult.orgId, c.session.orgId))
      .orderBy(desc(TbLinearRegressionResult.createdAt));
    return results;
  }

  // Fetch a specific regression result by ID along with its data points.
  // -----------------------------------------------------------------------
  export async function getResult(c: IContextUser, resultId: string) {
    const [result] = await c.db
      .select({
        id: TbLinearRegressionResult.id,
        energyResource: TbLinearRegressionResult.energyResource,
        meterSlices: TbLinearRegressionResult.meterSlices,
        driver: TbLinearRegressionResult.driver,
        slope: TbLinearRegressionResult.slope,
        intercept: TbLinearRegressionResult.intercept,
        rSquared: TbLinearRegressionResult.rSquared,
        ignoredRecordCount: TbLinearRegressionResult.ignoredRecordCount,
        // interpolateRate: TbLinearRegressionResult.interpolateRate,
        // interpolatedRecordCount:
        //   TbLinearRegressionResult.interpolatedRecordCount,
        datetimeStart: UtilDb.isoDatetime(
          TbLinearRegressionResult.datetimeStart,
        ),
        datetimeEnd: UtilDb.isoDatetime(TbLinearRegressionResult.datetimeEnd),
        period: TbLinearRegressionResult.period,
        createdAt: UtilDb.isoDatetime(TbLinearRegressionResult.createdAt),
      })
      .from(TbLinearRegressionResult)
      .where(
        and(
          eq(TbLinearRegressionResult.orgId, c.session.orgId),
          eq(TbLinearRegressionResult.id, resultId),
        ),
      );
    if (!result) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    // Get the associated data points
    // -----------------------------------------------------------------------
    const values = await c.db
      .select({
        x: TbLinearRegressionResultDataPoint.x,
        y: TbLinearRegressionResultDataPoint.y,
      })
      .from(TbLinearRegressionResultDataPoint)
      .where(
        and(
          eq(TbLinearRegressionResultDataPoint.resultId, resultId),
          eq(TbLinearRegressionResultDataPoint.orgId, c.orgId),
        ),
      )
      .orderBy(TbLinearRegressionResultDataPoint.y);

    return {
      ...result,
      values,
    };
  }
}
