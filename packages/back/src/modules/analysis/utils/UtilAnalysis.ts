import { EApiFailCode } from "common";
import { isNotNull, sql } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg } from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilMetricResourceValuePeriod } from "@m/measurement/utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "@m/measurement/utils/UtilMetricValueQuery";
import { UtilTimedSeries } from "@m/measurement/utils/UtilTimedSeries";

export namespace UtilAnalysis {
  export async function buildSeuNormalizedSeries(
    c: IContextOrg,
    query: {
      datetimeMin: string;
      datetimeMax: string;
    },
    seuId?: string,
    driverIds?: string[],
    meterSliceIds?: string[],
  ) {
    // Fetch slice and driver data
    // -----------------------------------------------------------------------
    // const period = ANALYSIS_PERIOD;
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    if (!seuId && !meterSliceIds) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "You must select seu or slice for normalized.",
      );
    }

    let tableCounterDeltaMetric;

    if (seuId) {
      tableCounterDeltaMetric =
        UtilMetricValueQuery.genQueryInterpolatedCounterDeltaSeuMeterSliceAgg(
          c,
          [seuId],
          period,
          [query.datetimeMin, query.datetimeMax],
        );
    } else {
      tableCounterDeltaMetric =
        UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterSliceAgg(
          c,
          meterSliceIds,
          period,
          [query.datetimeMin, query.datetimeMax],
        );
    }

    // Slice data will be interpolated individually,
    //   that's why they are not summed as seu only interested in sum
    //   of the slices
    const seuSlicesData = await c.db
      .with(tableCounterDeltaMetric)
      .select({
        sliceId: tableCounterDeltaMetric.meterSliceId,
        values: UtilDb.jsonAgg(
          {
            // Null values are filtered at where section
            value: sql<number>`${tableCounterDeltaMetric.value}`,
            datetime: UtilDb.isoDatetime(tableCounterDeltaMetric.bucket),
          },
          { orderBy: tableCounterDeltaMetric.bucket },
        ),
      })
      .from(tableCounterDeltaMetric)
      .where(isNotNull(tableCounterDeltaMetric.value))
      .groupBy(tableCounterDeltaMetric.meterSliceId);

    if (!seuSlicesData.length) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Slice data is insufficient or unavailable.",
      );
    }

    const tableDriverValues = driverIds
      ? UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
          c,
          driverIds,
          period,
          [query.datetimeMin, query.datetimeMax],
        )
      : // TODO
        // For suggestion, use all gauge metrics
        UtilMetricValueQuery.genQueryInterpolatedGaugeMetricAgg(
          c,
          undefined,
          period,
          [query.datetimeMin, query.datetimeMax],
        );

    const driverData = await c.db
      .with(tableDriverValues)
      .select({
        metricId: tableDriverValues.metricId,
        values: UtilDb.jsonAgg(
          {
            // Null values are filtered at where section
            value: sql<number>`${tableDriverValues.value}`,
            datetime: UtilDb.isoDatetime(tableDriverValues.bucket),
          },
          { orderBy: tableDriverValues.bucket },
        ),
      })
      .from(tableDriverValues)
      .where(isNotNull(tableDriverValues.value))
      .groupBy(tableDriverValues.metricId);

    if (driverIds && driverIds.length !== driverData.length) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Given driver resource values are insufficient or unavailable.",
      );
    }

    // Normalize (Truncate and Interpolate) values
    // -----------------------------------------------------------------------
    const seriesSeuSlices = seuSlicesData.map<ITimedValue[]>((d) => d.values);
    const seriesDrivers = driverData.map<ITimedValue[]>((d) => d.values);
    const seriesAll = [...seriesSeuSlices, ...seriesDrivers];

    const normalizeResult = UtilTimedSeries.normalizeSeries(seriesAll);

    const normalizedSeuSlices = normalizeResult.series.slice(
      0,
      seriesSeuSlices.length,
    );
    const normalizedDrivers = normalizeResult.series.slice(
      seriesSeuSlices.length,
    );

    if (!normalizedDrivers.length || !normalizedDrivers[0].length) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Normalized driver data is insufficient or unavailable.",
      );
    }

    const normalizedSeu = [];
    const refSerie = normalizedSeuSlices[0];
    for (let i = 0; i < refSerie.length; i++) {
      normalizedSeu.push({
        value: normalizedSeuSlices.reduce(
          (a, current) => a + current[i].value,
          0,
        ),
        datetime: refSerie[i].datetime,
      });
    }
    const driverDataIds = driverData.map((d) => d.metricId);

    return {
      normalizedDrivers,
      normalizedSeu,
      driverIds: driverDataIds,
      normalizeResult,
      period,
      sourceSeuSlicesData: seuSlicesData,
      sourceDriverData: driverData,
    };
  }
}
