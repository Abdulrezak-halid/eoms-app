import { EApiFailCode } from "common";
import {
  SQL,
  and,
  desc,
  eq,
  gte,
  isNotNull,
  lte,
  ne,
  or,
  sql,
} from "drizzle-orm";
import MLR from "ml-regression-multivariate-linear";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextCore,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { errorToObject } from "@m/core/middlewares/ErrorHandler";
import { ServiceMessageQueue } from "@m/core/services/ServiceMessageQueue";
import { UtilContext } from "@m/core/utils/UtilContext";
import { UtilDb } from "@m/core/utils/UtilDb";
import { TbMetric } from "@m/measurement/orm/TbMetric";
import { TbSeu } from "@m/measurement/orm/TbSeu";
import { VwMeterSlice } from "@m/measurement/orm/VwMeterSlice";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";
import { UtilMetricValueQuery } from "@m/measurement/utils/UtilMetricValueQuery";
import { UtilTimedSeries } from "@m/measurement/utils/UtilTimedSeries";

import { IAdvancedRegressionResult } from "../interfaces/IAdvancedRegressionResult";
import { TbAdvancedRegressionResult } from "../orm/TbAdvancedRegressionResult";
import { TbAdvancedRegressionResultDriver } from "../orm/TbAdvancedRegressionResultDriver";
import { TbAdvancedRegressionResultSlice } from "../orm/TbAdvancedRegressionResultSlice";
import { TbAdvancedRegressionResultValue } from "../orm/TbAdvancedRegressionResultValue";
import { TbRegressionSuggestion } from "../orm/TbRegressionSuggestion";
import { TbRegressionSuggestionDriver } from "../orm/TbRegressionSuggestionDriver";
import { UtilAnalysis } from "../utils/UtilAnalysis";

/**
 * Analyse supports multiple meter slice series internally.
 * But the result keeps only sum of the all slices.
 * Slice data could be summed at the beginning of the analyse
 * but it summed at the end instead to make it conveint for future
 * to add multi slice data support.
 * Seu => slice_1, slice_2 => analyse => slice_1, slice_2 => sum of slice
 */

export namespace ServiceAdvancedRegression {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbAdvancedRegressionResult);
  }

  export async function calculate(
    c: IContextOrg,
    params: {
      driverIds: string[];
      dateTrainStart: string;
      dateTrainEnd: string;
      datePredictStart: string;
      datePredictEnd: string;
      seuId?: string;
      meterSliceIds?: string[];
    },
  ) {
    if (!params.seuId && !params.meterSliceIds) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "You must select seu or slice for analysis.",
      );
    }

    const {
      normalizeResult,
      normalizedDrivers,
      normalizedSeu,
      period,
      sourceDriverData,
      sourceSeuSlicesData,
    } = await UtilAnalysis.buildSeuNormalizedSeries(
      c,
      {
        datetimeMin: params.dateTrainStart,
        datetimeMax: params.dateTrainEnd,
      },
      params.seuId,
      params.driverIds,
      params.meterSliceIds,
    );

    // Train
    // Train data should be like this; (for 3 drivers and 2 slices)
    // Data of different metrics are ordered by slice id
    // x values = [
    //   [d1_v1, d2_v1, d3_v1], -> Date A
    //   [d1_v2, d2_v2, d3_v2], -> Date B
    //   [d1_v3, d2_v3, d3_v3], -> Date C
    // ]
    // y values = [
    //   [ms1_v1, ms2_v1], -> Date A
    //   [ms1_v2, ms2_v2], -> Date B
    //   [ms1_v3, ms2_v3], -> Date C
    // ]
    // -----------------------------------------------------------------------
    const xTrain: number[][] = [];
    const yTrain: number[][] = [];

    for (let i = 0; i < normalizedDrivers[0].length; ++i) {
      xTrain.push(normalizedDrivers.map((d) => d[i].value));
      yTrain.push([normalizedSeu[i].value]);
    }

    // Fetch driver data for prediction
    // -----------------------------------------------------------------------
    const tableUnionMetric =
      UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
        c,
        params.driverIds,
        period,
        [params.datePredictStart, params.datePredictEnd],
      );

    const driverDataForPrediction = await c.db
      .with(tableUnionMetric)
      .select({
        list: UtilDb.jsonAgg({
          metricId: tableUnionMetric.metricId,
          // Null values are filtered at where section
          value: sql<number>`${tableUnionMetric.value}`,
        }),
        datetime: UtilDb.isoDatetime(tableUnionMetric.bucket),
      })
      .from(tableUnionMetric)
      .where(isNotNull(tableUnionMetric.value))
      .groupBy(tableUnionMetric.bucket)
      .orderBy(tableUnionMetric.bucket);

    // Ignore all driver data if one of the driver data is missing for the
    //   same datetime.
    const filteredDriverDataForPrediction = driverDataForPrediction.filter(
      (data) => data.list.length === params.driverIds.length,
    );

    // Predict
    // -----------------------------------------------------------------------
    const mlr = new MLR(xTrain, yTrain);
    const predictionInput: number[][] = filteredDriverDataForPrediction.map(
      (d) =>
        d.list
          .sort((a, b) => a.metricId.localeCompare(b.metricId))
          .map((metric) => metric.value),
    );

    const predictions = mlr.predict(predictionInput);

    // Result
    // -----------------------------------------------------------------------
    const observedData = params.seuId
      ? await ServiceSeu.getGraphValues(c, {
          datetimeMin: params.datePredictStart,
          datetimeMax: params.datePredictEnd,
          seuIds: [params.seuId],
        })
      : await ServiceMeterSlice.getGraphValues(c, {
          datetimeMin: params.datePredictStart,
          datetimeMax: params.datePredictEnd,
          meterSliceIds: params.meterSliceIds ? params.meterSliceIds : [],
        });

    let observedValues: ITimedValue[] = [];

    if (params.seuId) {
      observedValues = observedData.series[0].values;
    } else {
      const sliceSeries = observedData.series.map((s) => s.values);
      const normResult = UtilTimedSeries.normalizeSeries(sliceSeries);

      if (normResult.series.length > 0 && normResult.series[0].length > 0) {
        const refSerie = normResult.series[0];
        for (let i = 0; i < refSerie.length; i++) {
          observedValues.push({
            datetime: refSerie[i].datetime,
            value: normResult.series.reduce(
              (sum, curr) => sum + curr[i].value,
              0,
            ),
          });
        }
      }
    }

    // Input slice id order and result slice order is the same
    // Predictions contains only values, to find slice ids and datetimes
    //   benefit from other lists.
    const datetimes = filteredDriverDataForPrediction.map((d) => d.datetime);
    const expectedValues: ITimedValue[] = datetimes.map((datetime, i) => ({
      datetime,
      value: predictions[i][0],
    }));

    const {
      series: [normalizedObserved, normalizedExpected],
    } = UtilTimedSeries.normalizeSeries([observedValues, expectedValues]);

    const differenceValues = UtilTimedSeries.difference(
      normalizedExpected,
      normalizedObserved,
    );

    const cumulativeDifferenceValues =
      UtilTimedSeries.cumulative(differenceValues);

    const rSquared = UtilTimedSeries.rSquared(
      normalizedObserved,
      normalizedExpected,
    );

    const rmse = UtilTimedSeries.rmse(normalizedObserved, normalizedExpected);

    const sourceDrivers = sourceDriverData.map((d) => ({
      id: d.metricId,
      values: d.values,
    }));

    const sourceMeterSlices = sourceSeuSlicesData.map((d) => ({
      id: d.sliceId,
      values: d.values,
    }));

    const result: IAdvancedRegressionResult = {
      // trainRecordInterpolatedCount: normalizeResult.interpolatedRecordCount,
      // trainRecordInterpolateRate: normalizeResult.interpolateRate,
      trainRecordIgnoredCount: normalizeResult.truncatedRecordCount,
      period: period,
      rSquared,
      rmse,
      expectedValues: UtilTimedSeries.roundHighPrecision(expectedValues),
      observedValues: UtilTimedSeries.roundHighPrecision(normalizedObserved),
      differenceValues: UtilTimedSeries.roundHighPrecision(differenceValues),
      cumulativeDifferenceValues: UtilTimedSeries.roundHighPrecision(
        cumulativeDifferenceValues,
      ),
      sourceMeterSlices,
      sourceDrivers,
    };

    return result;
  }

  export async function saveResults(
    c: IContextCore,
    params: {
      orgId: string;
      userId: string;
      dateTrainStart: string;
      dateTrainEnd: string;
      datePredictStart: string;
      datePredictEnd: string;
      driverIds: string[];
      seuId?: string;
      meterSliceIds?: string[];
      result: IAdvancedRegressionResult;
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [insertedResult] = await tx
        .insert(TbAdvancedRegressionResult)
        .values({
          orgId: params.orgId,
          dateTrainStart: params.dateTrainStart,
          dateTrainEnd: params.dateTrainEnd,
          datePredictStart: params.datePredictStart,
          datePredictEnd: params.datePredictEnd,
          seuId: params.seuId,
          period: params.result.period,
          rSquared: params.result.rSquared,
          rmse: params.result.rmse,
          // trainRecordInterpolatedCount:
          //   params.result.trainRecordInterpolatedCount,
          // trainRecordInterpolateRate: params.result.trainRecordInterpolateRate,
          trainRecordIgnoredCount: params.result.trainRecordIgnoredCount,
          createdBy: params.userId,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbAdvancedRegressionResult.id });

      if (params.driverIds.length) {
        await tx.insert(TbAdvancedRegressionResultDriver).values(
          params.driverIds.map((id) => ({
            metricId: id,
            subjectId: insertedResult.id,
            orgId: params.orgId,
          })),
        );
      }

      const meterSliceIds: string[] = [];

      if (params.seuId) {
        const seu = await ServiceSeu.get(
          { ...c, orgId: params.orgId, db: tx },
          params.seuId,
          {
            datetimeMin: params.dateTrainStart,
            datetimeMax: params.dateTrainEnd,
          },
        );

        meterSliceIds.push(...seu.meterSlices.map((slice) => slice.id));

        await tx.insert(TbAdvancedRegressionResultSlice).values(
          seu.meterSlices.map((slice) => ({
            sliceId: slice.id,
            subjectId: insertedResult.id,
            orgId: params.orgId,
          })),
        );
      } else if (params.meterSliceIds && params.meterSliceIds.length) {
        meterSliceIds.push(...params.meterSliceIds);

        await tx.insert(TbAdvancedRegressionResultSlice).values(
          params.meterSliceIds.map((id) => ({
            sliceId: id,
            subjectId: insertedResult.id,
            orgId: params.orgId,
          })),
        );
      }

      const serieKeys = [
        "expectedValues",
        "observedValues",
        "differenceValues",
        "cumulativeDifferenceValues",
      ] as const;
      const serieTypes = [
        "EXPECTED",
        "OBSERVED",
        "DIFFERENCE",
        "CUMULATIVE_DIFFERENCE",
      ] as const;

      const valuesToInsert: (typeof TbAdvancedRegressionResultValue.$inferInsert)[] =
        [
          ...serieKeys.flatMap((key, iKey) =>
            params.result[key].map((v) => ({
              orgId: params.orgId,
              subjectId: insertedResult.id,
              datetime: v.datetime,
              value: v.value,
              type: serieTypes[iKey],
              sourceMetricId: null,
              sourceMeterSliceId: null,
            })),
          ),
          ...params.result.sourceDrivers.flatMap((g) =>
            g.values.map((v) => ({
              orgId: params.orgId,
              subjectId: insertedResult.id,
              datetime: v.datetime,
              value: v.value,
              type: "SOURCE_DRIVER" as const,
              sourceMetricId: g.id,
              sourceMeterSliceId: null,
            })),
          ),
          ...params.result.sourceMeterSlices.flatMap((g) =>
            g.values.map((v) => ({
              orgId: params.orgId,
              subjectId: insertedResult.id,
              datetime: v.datetime,
              value: v.value,
              type: "SOURCE_METER_SLICE" as const,
              sourceMetricId: null,
              sourceMeterSliceId: g.id,
            })),
          ),
        ];

      if (valuesToInsert.length > 0) {
        await tx.insert(TbAdvancedRegressionResultValue).values(valuesToInsert);
      }

      c.logger.info(
        {
          resultId: insertedResult.id,
          predictedValueCount: params.result.expectedValues.length,
        },
        "Advanced regression results saved successfully.",
      );

      return insertedResult.id;
    });
  }

  export async function setPrimary(
    c: IContextUser,
    id: string,
    value: boolean,
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbAdvancedRegressionResult)
        .set({ primary: value })
        .where(
          and(
            eq(TbAdvancedRegressionResult.orgId, c.session.orgId),
            eq(TbAdvancedRegressionResult.id, id),
            isNotNull(TbAdvancedRegressionResult.seuId),
          ),
        )
        .returning({ seuId: TbAdvancedRegressionResult.seuId });

      if (!record || record.seuId === null) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Regression result is not found to set primary or this result not created with SEU.",
        );
      }

      if (value) {
        await tx
          .update(TbAdvancedRegressionResult)
          .set({ primary: false })
          .where(
            and(
              eq(TbAdvancedRegressionResult.orgId, c.session.orgId),
              eq(TbAdvancedRegressionResult.seuId, record.seuId),
              ne(TbAdvancedRegressionResult.id, id),
            ),
          );
      }
    });
  }

  export async function setThreshold(
    c: IContextUser,
    id: string,
    value: number | null,
  ) {
    await c.db
      .update(TbAdvancedRegressionResult)
      .set({ threshold: value })
      .where(
        and(
          eq(TbAdvancedRegressionResult.id, id),
          eq(TbAdvancedRegressionResult.orgId, c.orgId),
        ),
      );
  }

  export async function removeResult(c: IContextUser, resultId: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbAdvancedRegressionResultDriver)
        .where(
          and(
            eq(TbAdvancedRegressionResultDriver.orgId, c.session.orgId),
            eq(TbAdvancedRegressionResultDriver.subjectId, resultId),
          ),
        );
      await tx
        .delete(TbAdvancedRegressionResultSlice)
        .where(
          and(
            eq(TbAdvancedRegressionResultSlice.orgId, c.session.orgId),
            eq(TbAdvancedRegressionResultSlice.subjectId, resultId),
          ),
        );
      await tx
        .delete(TbAdvancedRegressionResultValue)
        .where(
          and(
            eq(TbAdvancedRegressionResultValue.orgId, c.session.orgId),
            eq(TbAdvancedRegressionResultValue.subjectId, resultId),
          ),
        );
      await tx
        .delete(TbAdvancedRegressionResult)
        .where(
          and(
            eq(TbAdvancedRegressionResult.orgId, c.session.orgId),
            eq(TbAdvancedRegressionResult.id, resultId),
          ),
        );
    });
  }

  export async function getAllResults(
    c: IContextOrg,
    options?: { primary?: boolean; datetimeMin?: string; datetimeMax?: string },
  ) {
    const filters: (SQL | undefined)[] = [
      eq(TbAdvancedRegressionResult.orgId, c.orgId),
    ];

    if (options?.primary === true) {
      filters.push(eq(TbAdvancedRegressionResult.primary, true));
    }

    if (options?.datetimeMin || options?.datetimeMax) {
      const dateFilterTrain: SQL[] = [];
      const dateFilterPredict: SQL[] = [];

      if (options?.datetimeMin) {
        dateFilterTrain.push(
          gte(TbAdvancedRegressionResult.dateTrainEnd, options.datetimeMin),
        );
        dateFilterPredict.push(
          gte(TbAdvancedRegressionResult.datePredictEnd, options.datetimeMin),
        );
      }
      if (options?.datetimeMax) {
        dateFilterTrain.push(
          lte(TbAdvancedRegressionResult.dateTrainStart, options.datetimeMax),
        );
        dateFilterPredict.push(
          lte(TbAdvancedRegressionResult.datePredictStart, options.datetimeMax),
        );
      }

      filters.push(or(and(...dateFilterTrain), and(...dateFilterPredict)));
    }

    const sqDrivers = c.db
      .select({
        subjectId: TbAdvancedRegressionResultDriver.subjectId,
        orgId: TbAdvancedRegressionResultDriver.orgId,
        drivers: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
            unitGroup: TbMetric.unitGroup,
          },
          { orderBy: TbMetric.name },
        ).as("drivers"),
      })
      .from(TbAdvancedRegressionResultDriver)
      .innerJoin(
        TbMetric,
        eq(TbMetric.id, TbAdvancedRegressionResultDriver.metricId),
      )
      .groupBy(
        TbAdvancedRegressionResultDriver.subjectId,
        TbAdvancedRegressionResultDriver.orgId,
      )
      .as("sq_drivers");

    const sqSlices = c.db
      .select({
        subjectId: TbAdvancedRegressionResultSlice.subjectId,
        slices: UtilDb.jsonAgg(
          {
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
          },
          { orderBy: VwMeterSlice.name },
        ).as("slices"),
      })
      .from(TbAdvancedRegressionResultSlice)
      .innerJoin(
        VwMeterSlice,
        eq(VwMeterSlice.id, TbAdvancedRegressionResultSlice.sliceId),
      )
      .groupBy(TbAdvancedRegressionResultSlice.subjectId)
      .as("sq_slices");

    const results = await c.db
      .select({
        id: TbAdvancedRegressionResult.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        slices: sqSlices.slices,
        drivers: sqDrivers.drivers,

        primary: TbAdvancedRegressionResult.primary,
        threshold: TbAdvancedRegressionResult.threshold,
        dateTrainStart: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.dateTrainStart,
        ),
        dateTrainEnd: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.dateTrainEnd,
        ),
        datePredictStart: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.datePredictStart,
        ),
        datePredictEnd: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.datePredictEnd,
        ),
        period: TbAdvancedRegressionResult.period,
        rSquared: TbAdvancedRegressionResult.rSquared,
        rmse: TbAdvancedRegressionResult.rmse,
        // trainRecordInterpolatedCount:
        //   TbAdvancedRegressionResult.trainRecordInterpolatedCount,
        // trainRecordInterpolateRate:
        //   TbAdvancedRegressionResult.trainRecordInterpolateRate,
        trainRecordIgnoredCount:
          TbAdvancedRegressionResult.trainRecordIgnoredCount,
        createdAt: UtilDb.isoDatetime(TbAdvancedRegressionResult.createdAt),
      })
      .from(TbAdvancedRegressionResult)
      .innerJoin(
        sqDrivers,
        and(
          eq(sqDrivers.orgId, TbAdvancedRegressionResult.orgId),
          eq(sqDrivers.subjectId, TbAdvancedRegressionResult.id),
        ),
      )
      .innerJoin(
        sqSlices,
        eq(sqSlices.subjectId, TbAdvancedRegressionResult.id),
      )
      .leftJoin(TbSeu, eq(TbSeu.id, TbAdvancedRegressionResult.seuId))
      .where(and(...filters))
      .orderBy(desc(TbAdvancedRegressionResult.createdAt));

    return results;
  }

  export async function getResult(
    c: IContextOrg,
    includeSources?: boolean,
    resultId?: string,
  ) {
    const filters: SQL[] = [eq(TbAdvancedRegressionResult.orgId, c.orgId)];

    if (resultId) {
      filters.push(eq(TbAdvancedRegressionResult.id, resultId));
    }

    const sqDrivers = c.db
      .select({
        subjectId: TbAdvancedRegressionResultDriver.subjectId,
        orgId: TbAdvancedRegressionResultDriver.orgId,
        drivers: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
            unitGroup: TbMetric.unitGroup,
          },
          { orderBy: TbMetric.name },
        ).as("drivers"),
      })
      .from(TbAdvancedRegressionResultDriver)
      .innerJoin(
        TbMetric,
        eq(TbMetric.id, TbAdvancedRegressionResultDriver.metricId),
      )
      .groupBy(
        TbAdvancedRegressionResultDriver.subjectId,
        TbAdvancedRegressionResultDriver.orgId,
      )
      .as("sq_drivers");

    const sqSlices = c.db
      .select({
        subjectId: TbAdvancedRegressionResultSlice.subjectId,
        slices: UtilDb.jsonAgg(
          {
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
          },
          { orderBy: VwMeterSlice.name },
        ).as("slices"),
      })
      .from(TbAdvancedRegressionResultSlice)
      .innerJoin(
        VwMeterSlice,
        eq(VwMeterSlice.id, TbAdvancedRegressionResultSlice.sliceId),
      )
      .groupBy(TbAdvancedRegressionResultSlice.subjectId)
      .as("sq_slices");

    const [result] = await c.db
      .select({
        id: TbAdvancedRegressionResult.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        drivers: sqDrivers.drivers,
        slices: sqSlices.slices,
        primary: TbAdvancedRegressionResult.primary,
        threshold: TbAdvancedRegressionResult.threshold,
        dateTrainStart: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.dateTrainStart,
        ),
        dateTrainEnd: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.dateTrainEnd,
        ),
        datePredictStart: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.datePredictStart,
        ),
        datePredictEnd: UtilDb.isoDatetime(
          TbAdvancedRegressionResult.datePredictEnd,
        ),
        period: TbAdvancedRegressionResult.period,
        rSquared: TbAdvancedRegressionResult.rSquared,
        rmse: TbAdvancedRegressionResult.rmse,
        // trainRecordInterpolatedCount:
        //   TbAdvancedRegressionResult.trainRecordInterpolatedCount,
        // trainRecordInterpolateRate:
        //   TbAdvancedRegressionResult.trainRecordInterpolateRate,
        trainRecordIgnoredCount:
          TbAdvancedRegressionResult.trainRecordIgnoredCount,
        createdAt: UtilDb.isoDatetime(TbAdvancedRegressionResult.createdAt),
      })
      .from(TbAdvancedRegressionResult)
      .innerJoin(
        sqDrivers,
        and(
          eq(sqDrivers.orgId, TbAdvancedRegressionResult.orgId),
          eq(sqDrivers.subjectId, TbAdvancedRegressionResult.id),
        ),
      )
      .innerJoin(
        sqSlices,
        eq(sqSlices.subjectId, TbAdvancedRegressionResult.id),
      )
      .leftJoin(TbSeu, eq(TbSeu.id, TbAdvancedRegressionResult.seuId))
      .where(and(...filters))
      // Limited and ordered for the get latest result.
      .orderBy(desc(TbAdvancedRegressionResult.createdAt))
      .limit(1);

    if (!result) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    const valueFilters: SQL[] = [
      eq(TbAdvancedRegressionResultValue.orgId, c.orgId),
      eq(TbAdvancedRegressionResultValue.subjectId, result.id),
    ];

    if (!includeSources) {
      valueFilters.push(
        ne(TbAdvancedRegressionResultValue.type, "SOURCE_DRIVER"),
        ne(TbAdvancedRegressionResultValue.type, "SOURCE_METER_SLICE"),
      );
    }

    const valueResult = await c.db
      .select({
        type: TbAdvancedRegressionResultValue.type,
        value: TbAdvancedRegressionResultValue.value,
        datetime: UtilDb.isoDatetime(TbAdvancedRegressionResultValue.datetime),
        sourceMetricId: TbAdvancedRegressionResultValue.sourceMetricId,
        sourceMeterSliceId: TbAdvancedRegressionResultValue.sourceMeterSliceId,
      })
      .from(TbAdvancedRegressionResultValue)
      .where(and(...valueFilters))
      .orderBy(TbAdvancedRegressionResultValue.datetime);

    const groupedValues = valueResult.reduce(
      (d, row) => {
        if (row.type === "SOURCE_DRIVER") {
          const id = row.sourceMetricId as string;
          let group = d.sourceDrivers.find((g) => g.id === id);
          if (!group) {
            group = { id, values: [] };
            d.sourceDrivers.push(group);
          }
          group.values.push({ value: row.value, datetime: row.datetime });
        } else if (row.type === "SOURCE_METER_SLICE") {
          const id = row.sourceMeterSliceId as string;
          let group = d.sourceMeterSlices.find((g) => g.id === id);
          if (!group) {
            group = { id, values: [] };
            d.sourceMeterSlices.push(group);
          }
          group.values.push({ value: row.value, datetime: row.datetime });
        } else {
          const map: Record<string, keyof typeof d> = {
            EXPECTED: "expectedValues",
            OBSERVED: "observedValues",
            DIFFERENCE: "differenceValues",
            CUMULATIVE_DIFFERENCE: "cumulativeDifferenceValues",
          };
          const key = map[row.type];
          if (key && Array.isArray(d[key])) {
            (d[key] as ITimedValue[]).push({
              value: row.value,
              datetime: row.datetime,
            });
          }
        }
        return d;
      },
      {
        expectedValues: [] as ITimedValue[],
        observedValues: [] as ITimedValue[],
        differenceValues: [] as ITimedValue[],
        cumulativeDifferenceValues: [] as ITimedValue[],
        sourceMeterSlices: [] as {
          id: string;
          values: ITimedValue[];
        }[],
        sourceDrivers: [] as {
          id: string;
          values: ITimedValue[];
        }[],
      },
    );

    return {
      ...result,
      ...groupedValues,
    };
  }

  export async function createSuggestions(
    c: IContextOrg,
    options: {
      datetimeMin: string;
      datetimeMax: string;
      // Used for dev seed purposes
      skipProducingMessage?: boolean;
    },
    seuId?: string,
  ) {
    const messagesToSend: { queue: string; content: Buffer }[] = [];

    const suggestionIds = await c.db.transaction(async (tx) => {
      const seuIds: string[] = [];

      if (seuId) {
        seuIds.push(seuId);
      } else {
        const records = await tx
          .select({ id: TbSeu.id })
          .from(TbSeu)
          .where(eq(TbSeu.orgId, c.orgId));

        if (!records.length) {
          throw new ApiException(
            EApiFailCode.NOT_FOUND,
            "There is no seu for suggestion.",
          );
        }
        seuIds.push(...records.map((r) => r.id));
      }

      const createdIds: string[] = [];

      for (const id of seuIds) {
        const [record] = await tx
          .insert(TbRegressionSuggestion)
          .values({
            status: "PENDING",
            seuId: id,
            orgId: c.orgId,
            createdAt: c.nowDatetime,
            datetimeStart: options.datetimeMin,
            datetimeEnd: options.datetimeMax,
          })
          .returning({ id: TbRegressionSuggestion.id });

        createdIds.push(record.id);

        if (options.skipProducingMessage) {
          continue;
        }

        if (!c.env.QUEUE_ANALYZER_FEATURE_ELIMINATION) {
          c.logger.error(
            "Analyzer feature elimination queue is not set, producing message is skipped.",
          );

          await tx
            .update(TbRegressionSuggestion)
            .set({ status: "FAILED", failInfo: "MESSAGE_PRODUCE_FAILED" })
            .where(eq(TbRegressionSuggestion.id, record.id));
          continue;
        }

        try {
          const data = await UtilAnalysis.buildSeuNormalizedSeries(
            UtilContext.overwriteDb(c, tx),
            {
              datetimeMin: options.datetimeMin,
              datetimeMax: options.datetimeMax,
            },
            id,
          );

          const x: number[][] = data.normalizedSeu.map((_, i) =>
            data.normalizedDrivers.map((driver) => driver[i].value),
          );

          // y target for rfecv algorithm
          const y: number[] = data.normalizedSeu.map((d) => d.value);

          const message = {
            x: x,
            y: y,
            feature_ids: data.driverIds,
            target_id: id,
          };

          messagesToSend.push({
            queue: c.env.QUEUE_ANALYZER_FEATURE_ELIMINATION,
            content: Buffer.from(JSON.stringify(message)),
          });
        } catch (e) {
          c.logger.error(
            { error: errorToObject(e), seuId: id },
            "Analyzer feature elimination prepare failed.",
          );

          await tx
            .update(TbRegressionSuggestion)
            .set({ status: "FAILED", failInfo: "INSUFFICIENT_DATA" })
            .where(eq(TbRegressionSuggestion.id, record.id));
        }
      }

      return createdIds;
    });

    // Produce collected messages after transaction
    for (const msg of messagesToSend) {
      try {
        await ServiceMessageQueue.produce(msg.queue, msg.content);
      } catch (e) {
        c.logger.error(
          { error: errorToObject(e) },
          "Failed to produce message after commit",
        );
      }
    }

    return suggestionIds;
  }

  export async function getSuggestions(c: IContextOrg) {
    const records = await c.db
      .select({
        id: TbRegressionSuggestion.id,
        createdAt: UtilDb.isoDatetime(TbRegressionSuggestion.createdAt),
        datetimeStart: UtilDb.isoDatetime(TbRegressionSuggestion.datetimeStart),
        datetimeEnd: UtilDb.isoDatetime(TbRegressionSuggestion.datetimeEnd),
        status: TbRegressionSuggestion.status,
        failInfo: TbRegressionSuggestion.failInfo,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        drivers: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
            unitGroup: TbMetric.unitGroup,
          },
          { orderBy: TbMetric.name, excludeNull: true },
        ),
      })
      .from(TbRegressionSuggestion)
      .where(eq(TbRegressionSuggestion.orgId, c.orgId))
      .innerJoin(TbSeu, eq(TbSeu.id, TbRegressionSuggestion.seuId))
      .leftJoin(
        TbRegressionSuggestionDriver,
        and(
          eq(TbRegressionSuggestionDriver.orgId, c.orgId),
          eq(TbRegressionSuggestionDriver.subjectId, TbRegressionSuggestion.id),
        ),
      )
      .leftJoin(
        TbMetric,
        eq(TbMetric.id, TbRegressionSuggestionDriver.metricId),
      )
      .groupBy(TbRegressionSuggestion.id, TbSeu.id)
      .orderBy(TbRegressionSuggestion.seuId, TbRegressionSuggestion.createdAt);

    return records;
  }

  export async function getSuggestion(c: IContextOrg, id: string) {
    const [record] = await c.db
      .select({
        id: TbRegressionSuggestion.id,
        createdAt: UtilDb.isoDatetime(TbRegressionSuggestion.createdAt),
        datetimeStart: UtilDb.isoDatetime(TbRegressionSuggestion.datetimeStart),
        datetimeEnd: UtilDb.isoDatetime(TbRegressionSuggestion.datetimeEnd),
        status: TbRegressionSuggestion.status,
        failInfo: TbRegressionSuggestion.failInfo,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        drivers: UtilDb.jsonAgg(
          {
            id: TbMetric.id,
            name: TbMetric.name,
            unitGroup: TbMetric.unitGroup,
          },
          { orderBy: TbMetric.name, excludeNull: true },
        ),
      })
      .from(TbRegressionSuggestion)
      .where(
        and(
          eq(TbRegressionSuggestion.orgId, c.orgId),
          eq(TbRegressionSuggestion.id, id),
        ),
      )
      .innerJoin(TbSeu, eq(TbSeu.id, TbRegressionSuggestion.seuId))
      .leftJoin(
        TbRegressionSuggestionDriver,
        and(
          eq(TbRegressionSuggestionDriver.orgId, c.orgId),
          eq(TbRegressionSuggestionDriver.subjectId, TbRegressionSuggestion.id),
        ),
      )
      .leftJoin(
        TbMetric,
        eq(TbMetric.id, TbRegressionSuggestionDriver.metricId),
      )
      .groupBy(TbRegressionSuggestion.id, TbSeu.id)
      .orderBy(TbRegressionSuggestion.seuId, TbRegressionSuggestion.createdAt);

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Suggestion is not found.",
      );
    }

    return record;
  }

  export async function deleteSuggestion(c: IContextOrg, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbRegressionSuggestionDriver)
        .where(
          and(
            eq(TbRegressionSuggestionDriver.orgId, c.orgId),
            eq(TbRegressionSuggestionDriver.subjectId, id),
          ),
        );

      await tx
        .delete(TbRegressionSuggestion)
        .where(
          and(
            eq(TbRegressionSuggestion.id, id),
            eq(TbRegressionSuggestion.orgId, c.orgId),
          ),
        );
    });
  }
}
