import { and, between, eq, inArray, sql } from "drizzle-orm";

import { IContextOrg } from "@m/core/interfaces/IContext";
import { ServiceEnv } from "@m/core/services/ServiceEnv";

import { IMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";
import { IMetricType } from "../interfaces/IMetricType";
import { TbMeter } from "../orm/TbMeter";
import { TbMeterSlice } from "../orm/TbMeterSlice";
import { TbMetricResource } from "../orm/TbMetricResource";
import { VwSeuMeterSliceAll } from "../orm/VwSeuMeterSliceAll";
import { UtilMetricResourceValuePeriod } from "./UtilMetricResourceValuePeriod";

// Note: Intestingly "valueCount" is casted to string,
//   that's why it is manually casted to integer

export namespace UtilMetricValueQuery {
  export function genQueryInterpolatedGaugeResource(
    c: IContextOrg,
    resourceIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueGauge(period);

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        // orgId: table.orgId,
        resourceId: table.resourceId,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${
              interval.plain
            }, ${table.bucket})`.as("gapFillBucket"),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // avg() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueAvg}`.as("value")
          : sql<number | null>`interpolate(avg(${table.valueAvg}))`.as("value"),
      })
      .from(table)
      .where(
        and(
          eq(table.orgId, c.orgId),
          inArray(table.resourceId, resourceIds),
          between(table.bucket, ...datetimeRange),
        ),
      );

    return c.db
      .$with("interpolatedGauge")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(table.resourceId, sql`"gapFillBucket"`),
      );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedGaugeMetric(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueGauge(period);

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        // orgId: TbMetricResource.orgId,
        metricId: TbMetricResource.metricId,
        resourceId: TbMetricResource.id,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${
              interval.plain
            }, ${table.bucket})`.as("gapFillBucket"),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // avg() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueAvg}`.as("value")
          : sql<number | null>`interpolate(avg(${table.valueAvg}))`.as("value"),
      })
      .from(TbMetricResource)
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(table.bucket, ...datetimeRange),
        ),
      )
      .where(
        and(
          eq(TbMetricResource.orgId, c.orgId),
          inArray(TbMetricResource.metricId, metricIds),
        ),
      );

    return c.db.$with("interpolatedGauge").as(
      ServiceEnv.isTest()
        ? interpolatedSq
        : interpolatedSq.groupBy(
            // TbMetricResource.orgId,
            TbMetricResource.metricId,
            TbMetricResource.id,
            sql`"gapFillBucket"`,
          ),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedGaugeMetricAgg(
    c: IContextOrg,
    metricIds: string[] | undefined,
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueGauge(period);

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    // Gauge aggregation is not like counter delta,
    //  that's why it is grouped on the first query
    return c.db.$with("interpolatedGauge").as(
      c.db
        .select({
          // orgId: TbMetricResource.orgId,
          metricId: TbMetricResource.metricId,
          bucket: ServiceEnv.isTest()
            ? sql<string>`${table.bucket}`.as("bucket")
            : sql<string>`time_bucket_gapfill(${
                interval.plain
              }, ${table.bucket})`.as("gapFillBucket"),
          valueCount: sql<number | null>`sum(${table.valueCount})::INT`.as(
            "valueCount",
          ),
          value: ServiceEnv.isTest()
            ? sql<number | null>`sum(${table.valueAvg} * ${
                table.valueCount
              }) / sum(${table.valueCount})`.as("value")
            : sql<number | null>`interpolate(sum(${
                table.valueAvg
              } * ${table.valueCount}) / sum(${table.valueCount}))`.as("value"),
        })
        .from(TbMetricResource)
        .innerJoin(
          table,
          and(
            eq(table.orgId, TbMetricResource.orgId),
            eq(table.resourceId, TbMetricResource.id),
            between(table.bucket, ...datetimeRange),
          ),
        )
        .where(
          and(
            eq(TbMetricResource.orgId, c.orgId),
            metricIds && inArray(TbMetricResource.metricId, metricIds),
          ),
        )
        .groupBy(
          // TbMetricResource.orgId,
          TbMetricResource.metricId,
          ServiceEnv.isTest() ? table.bucket : sql`"gapFillBucket"`,
        ),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaResource(
    c: IContextOrg,
    resourceIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        // orgId: table.orgId,
        resourceId: table.resourceId,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${
              interval.plain
            }, ${table.bucket})`.as("gapFillBucket"),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax}`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax}))`.as("value"),
      })
      .from(table)
      .where(
        and(
          eq(table.orgId, c.orgId),
          inArray(table.resourceId, resourceIds),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      );

    const interpolated = c.db
      .$with("interpolatedCounter")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(table.resourceId, sql`"gapFillBucket"`),
      );

    return c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          // orgId: interpolated.orgId,
          resourceId: interpolated.resourceId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${interpolated.resourceId} order by ${
              interpolated.bucket
            }) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${interpolated.resourceId} order by ${
              interpolated.bucket
            }), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaMetric(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        // orgId: TbMetricResource.orgId,
        metricId: TbMetricResource.metricId,
        resourceId: TbMetricResource.id,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${
              interval.plain
            }, ${table.bucket})`.as("gapFillBucket"),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax}`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax}))`.as("value"),
      })
      .from(TbMetricResource)
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      )
      .where(
        and(
          eq(TbMetricResource.orgId, c.orgId),
          inArray(TbMetricResource.metricId, metricIds),
        ),
      );

    const interpolated = c.db.$with("interpolatedCounter").as(
      ServiceEnv.isTest()
        ? interpolatedSq
        : interpolatedSq.groupBy(
            // TbMetricResource.orgId,
            TbMetricResource.metricId,
            TbMetricResource.id,
            sql`"gapFillBucket"`,
          ),
    );

    return c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          // orgId: interpolated.orgId,
          metricId: interpolated.metricId,
          resourceId: interpolated.resourceId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          // No need to order by metricId, since resourceId is enough
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${
              interpolated.resourceId
            } order by ${interpolated.bucket}) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${interpolated.resourceId} order by ${
              interpolated.bucket
            }), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaMetricAgg(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );
    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        // orgId: TbMetricResource.orgId,
        resourceId: TbMetricResource.id,
        metricId: TbMetricResource.metricId,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${
              interval.plain
            }, ${table.bucket})`.as("gapFillBucket"),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax}`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax}))`.as("value"),
      })
      .from(TbMetricResource)
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      )
      .where(
        and(
          eq(TbMetricResource.orgId, c.orgId),
          inArray(TbMetricResource.metricId, metricIds),
        ),
      );

    const interpolated = c.db
      .$with("interpolatedCounter")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(
              TbMetricResource.id,
              TbMetricResource.metricId,
              sql`"gapFillBucket"`,
            ),
      );

    const deltaCounter = c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          // orgId: interpolated.orgId,
          metricId: interpolated.metricId,
          // resourceId: interpolated.resourceId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${
              interpolated.resourceId
            } order by ${interpolated.bucket}) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${interpolated.resourceId} order by ${
              interpolated.bucket
            }), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );

    return c.db.$with("deltaCounterAgg").as(
      c.db
        .with(deltaCounter)
        .select({
          // orgId: deltaCounter.orgId,
          metricId: deltaCounter.metricId,
          bucket: deltaCounter.bucket,
          valueCount: sql<
            number | null
          >`sum(${deltaCounter.valueCount})::INT`.as("valueCount"),
          value: sql<number | null>`sum(${deltaCounter.value})`.as("value"),
        })
        .from(deltaCounter)
        .groupBy(
          // deltaCounter.orgId,
          deltaCounter.metricId,
          deltaCounter.bucket,
        ),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaMeterSlice(
    c: IContextOrg,
    meterSliceIds: string[] | undefined,
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        resourceId: sql<string>`${TbMetricResource.id}`.as("resourceId"),
        meterId: sql<string>`${TbMeterSlice.subjectId}`.as("meterId"),
        meterSliceId: sql<string>`${TbMeterSlice.id}`.as("meterSliceId"),
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${interval.plain}, ${table.bucket})`.as(
              "gapFillBucket",
            ),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}::INT`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax} * ${
              TbMeter.energyConversionRate
            } * ${TbMeterSlice.rate}`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax} * ${
              TbMeter.energyConversionRate
            } * ${TbMeterSlice.rate}))`.as("value"),
      })
      .from(TbMeterSlice)
      .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
      .innerJoin(
        TbMetricResource,
        and(
          eq(TbMetricResource.orgId, TbMeter.orgId),
          eq(TbMetricResource.metricId, TbMeter.metricId),
        ),
      )
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      )
      .where(
        and(
          eq(TbMeterSlice.orgId, c.orgId),
          meterSliceIds ? inArray(TbMeterSlice.id, meterSliceIds) : undefined,
        ),
      );

    const interpolated = c.db
      .$with("interpolatedCounter")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(
              TbMetricResource.id,
              TbMeterSlice.id,
              sql`"gapFillBucket"`,
            ),
      );

    return c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          // resourceId: interpolated.resourceId,
          meterId: interpolated.meterId,
          meterSliceId: interpolated.meterSliceId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          // Partition by only resourceId is not enough.
          //   There may be different meter slices that uses the same
          //   resourceId, that's why slice id is also in the partition.
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${interpolated.meterSliceId}, ${
              interpolated.resourceId
            } order by ${interpolated.bucket}) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${
              interpolated.meterSliceId
            }, ${interpolated.resourceId} order by ${interpolated.bucket}), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaMeterSliceAgg(
    c: IContextOrg,
    meterSliceIds: string[] | undefined,
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const deltaCounter = genQueryInterpolatedCounterDeltaMeterSlice(
      c,
      meterSliceIds,
      period,
      datetimeRange,
    );

    return c.db.$with("deltaCounterAgg").as(
      c.db
        .with(deltaCounter)
        .select({
          meterSliceId: deltaCounter.meterSliceId,
          bucket: deltaCounter.bucket,
          valueCount: sql<number | null>`sum(${deltaCounter.valueCount})`.as(
            "valueCount",
          ),
          value: sql<number | null>`sum(${deltaCounter.value})`.as("value"),
        })
        .from(deltaCounter)
        .groupBy(deltaCounter.meterSliceId, deltaCounter.bucket),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaMeterAgg(
    c: IContextOrg,
    meterIds: string[] | undefined,
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    // This method could use genQueryInterpolatedCounterDeltaMeterSlice and
    //   aggreagate in here, but divided values into slices and re summing
    //   them is unnecessary performance loss.
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );

    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        resourceId: sql<string>`${TbMetricResource.id}`.as("resourceId"),
        meterId: sql<string>`${TbMeter.id}`.as("meterId"),
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${interval.plain}, ${table.bucket})`.as(
              "gapFillBucket",
            ),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}::INT`.as("valueCount")
          : sql<number | null>`sum(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax} * ${
              TbMeter.energyConversionRate
            }`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax} * ${
              TbMeter.energyConversionRate
            }))`.as("value"),
      })
      .from(TbMeter)
      .innerJoin(
        TbMetricResource,
        and(
          eq(TbMetricResource.orgId, TbMeter.orgId),
          eq(TbMetricResource.metricId, TbMeter.metricId),
        ),
      )
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      )
      .where(
        and(
          eq(TbMeter.orgId, c.orgId),
          meterIds ? inArray(TbMeter.id, meterIds) : undefined,
        ),
      );

    const interpolated = c.db
      .$with("interpolatedCounter")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(
              TbMetricResource.id,
              TbMeter.id,
              sql`"gapFillBucket"`,
            ),
      );

    const deltaCounter = c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          // resourceId: interpolated.resourceId,
          meterId: interpolated.meterId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          // Partition by only resourceId is not enough.
          //   There may be different meters that uses the same
          //   resourceId, that's why meter id is also in the partition.
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${interpolated.meterId}, ${
              interpolated.resourceId
            } order by ${interpolated.bucket}) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${
              interpolated.meterId
            }, ${interpolated.resourceId} order by ${interpolated.bucket}), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );

    return c.db.$with("deltaCounterAgg").as(
      c.db
        .with(deltaCounter)
        .select({
          meterId: deltaCounter.meterId,
          bucket: deltaCounter.bucket,
          valueCount: sql<number | null>`sum(${deltaCounter.valueCount})`.as(
            "valueCount",
          ),
          value: sql<number | null>`sum(${deltaCounter.value})`.as("value"),
        })
        .from(deltaCounter)
        .groupBy(deltaCounter.meterId, deltaCounter.bucket),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedCounterDeltaSeuMeterSlice(
    c: IContextOrg,
    seuIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const table =
      UtilMetricResourceValuePeriod.getViewMetricResourceValueCounterCumulative(
        period,
      );
    const interval = UtilMetricResourceValuePeriod.getDbInterval(period);

    const interpolatedSq = c.db
      .select({
        resourceId: TbMetricResource.id,
        seuId: VwSeuMeterSliceAll.seuId,
        meterSliceId: VwSeuMeterSliceAll.meterSliceId,
        bucket: ServiceEnv.isTest()
          ? sql<string>`${table.bucket}`.as("bucket")
          : sql<string>`time_bucket_gapfill(${interval.plain}, ${table.bucket})`.as(
              "gapFillBucket",
            ),
        valueCount: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueCount}`.as("valueCount")
          : sql<number | null>`max(${table.valueCount})::INT`.as("valueCount"),
        // max() has no effect since one or none values will be in a bucket
        value: ServiceEnv.isTest()
          ? sql<number | null>`${table.valueMax} * ${
              TbMeter.energyConversionRate
            } * ${TbMeterSlice.rate}`.as("value")
          : sql<number | null>`interpolate(max(${table.valueMax} * ${
              TbMeter.energyConversionRate
            } * ${TbMeterSlice.rate}))`.as("value"),
      })
      .from(VwSeuMeterSliceAll)
      .innerJoin(
        TbMeterSlice,
        eq(TbMeterSlice.id, VwSeuMeterSliceAll.meterSliceId),
      )
      .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
      .innerJoin(
        TbMetricResource,
        and(
          eq(TbMetricResource.orgId, TbMeter.orgId),
          eq(TbMetricResource.metricId, TbMeter.metricId),
        ),
      )
      .innerJoin(
        table,
        and(
          eq(table.orgId, TbMetricResource.orgId),
          eq(table.resourceId, TbMetricResource.id),
          between(
            table.bucket,
            sql`(${datetimeRange[0]}::timestamp - interval ${sql.raw(interval.str)})`,
            datetimeRange[1],
          ),
        ),
      )
      .where(
        and(
          eq(VwSeuMeterSliceAll.orgId, c.orgId),
          inArray(VwSeuMeterSliceAll.seuId, seuIds),
        ),
      );

    const interpolated = c.db
      .$with("interpolatedCounter")
      .as(
        ServiceEnv.isTest()
          ? interpolatedSq
          : interpolatedSq.groupBy(
              TbMetricResource.id,
              VwSeuMeterSliceAll.seuId,
              VwSeuMeterSliceAll.meterSliceId,
              ServiceEnv.isTest() ? table.bucket : sql`"gapFillBucket"`,
            ),
      );

    return c.db.$with("deltaCounter").as(
      c.db
        .with(interpolated)
        .select({
          seuId: interpolated.seuId,
          meterSliceId: interpolated.meterSliceId,
          bucket: interpolated.bucket,
          valueCount: interpolated.valueCount,
          // Partition by only resourceId is not enough.
          //   There may be different meter slices that uses the same
          //   resourceId, that's why slice id is also in the partition.
          value: sql<number | null>`case
            when ${interpolated.value} is null or lag(${
              interpolated.value
            }) over (partition by ${interpolated.meterSliceId}, ${
              interpolated.resourceId
            } order by ${interpolated.bucket}) is null then null
            else greatest(${interpolated.value} - lag(${
              interpolated.value
            }) over (partition by ${
              interpolated.meterSliceId
            }, ${interpolated.resourceId} order by ${interpolated.bucket}), 0)
            end`.as("value"),
        })
        .from(interpolated),
    );
  }

  export function genQueryInterpolatedCounterDeltaSeuMeterSliceAgg(
    c: IContextOrg,
    seuIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const deltaCounter = genQueryInterpolatedCounterDeltaSeuMeterSlice(
      c,
      seuIds,
      period,
      datetimeRange,
    );

    return c.db.$with("deltaCounterAgg").as(
      c.db
        .with(deltaCounter)
        .select({
          meterSliceId: deltaCounter.meterSliceId,
          bucket: deltaCounter.bucket,
          valueCount: sql<number | null>`sum(${deltaCounter.valueCount})`.as(
            "valueCount",
          ),
          value: sql<number | null>`sum(${deltaCounter.value})`.as("value"),
        })
        .from(deltaCounter)
        .groupBy(deltaCounter.meterSliceId, deltaCounter.bucket),
    );
  }

  export function genQueryInterpolatedCounterDeltaSeuAgg(
    c: IContextOrg,
    seuIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const deltaCounter = genQueryInterpolatedCounterDeltaSeuMeterSlice(
      c,
      seuIds,
      period,
      datetimeRange,
    );

    return c.db.$with("deltaCounterAgg").as(
      c.db
        .with(deltaCounter)
        .select({
          seuId: deltaCounter.seuId,
          bucket: deltaCounter.bucket,
          valueCount: sql<number | null>`sum(${deltaCounter.valueCount})`.as(
            "valueCount",
          ),
          value: sql<number | null>`sum(${deltaCounter.value})`.as("value"),
        })
        .from(deltaCounter)
        .groupBy(deltaCounter.seuId, deltaCounter.bucket),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedUnionResource(
    c: IContextOrg,
    resourceIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const gauge = genQueryInterpolatedGaugeResource(
      c,
      resourceIds,
      period,
      datetimeRange,
    );
    const counterDelta = genQueryInterpolatedCounterDeltaResource(
      c,
      resourceIds,
      period,
      datetimeRange,
    );

    return c.db.$with("unionAll").as(
      c.db
        .with(gauge)
        .select({
          type: sql<IMetricType>`'GAUGE'`.as("type"),
          // orgId: gauge.orgId,
          resourceId: gauge.resourceId,
          bucket: gauge.bucket,
          valueCount: gauge.valueCount,
          value: gauge.value,
        })
        .from(gauge)
        .unionAll(
          c.db
            .with(counterDelta)
            .select({
              type: sql<IMetricType>`'COUNTER'`.as("type"),
              // orgId: counterDelta.orgId,
              resourceId: counterDelta.resourceId,
              bucket: counterDelta.bucket,
              valueCount: counterDelta.valueCount,
              value: counterDelta.value,
            })
            .from(counterDelta),
        ),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedUnionMetric(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const gauge = genQueryInterpolatedGaugeMetric(
      c,
      metricIds,
      period,
      datetimeRange,
    );
    const counterDelta = genQueryInterpolatedCounterDeltaMetric(
      c,
      metricIds,
      period,
      datetimeRange,
    );

    return c.db.$with("unionAll").as(
      c.db
        .with(gauge)
        .select({
          type: sql<IMetricType>`'GAUGE'`.as("type"),
          // orgId: gauge.orgId,
          metricId: gauge.metricId,
          resourceId: gauge.resourceId,
          bucket: gauge.bucket,
          valueCount: gauge.valueCount,
          value: gauge.value,
        })
        .from(gauge)
        .unionAll(
          c.db
            .with(counterDelta)
            .select({
              type: sql<IMetricType>`'COUNTER'`.as("type"),
              // orgId: counterDelta.orgId,
              metricId: counterDelta.metricId,
              resourceId: counterDelta.resourceId,
              bucket: counterDelta.bucket,
              valueCount: counterDelta.valueCount,
              value: counterDelta.value,
            })
            .from(counterDelta),
        ),
    );
  }

  // ---------------------------------------------------------------

  export function genQueryInterpolatedUnionMetricAgg(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const gauge = genQueryInterpolatedGaugeMetricAgg(
      c,
      metricIds,
      period,
      datetimeRange,
    );
    const counterDelta = genQueryInterpolatedCounterDeltaMetricAgg(
      c,
      metricIds,
      period,
      datetimeRange,
    );

    return c.db.$with("unionAll").as(
      c.db
        .with(gauge)
        .select({
          type: sql<IMetricType>`'GAUGE'`.as("type"),
          // orgId: gauge.orgId,
          metricId: gauge.metricId,
          bucket: gauge.bucket,
          valueCount: gauge.valueCount,
          value: gauge.value,
        })
        .from(gauge)
        .unionAll(
          c.db
            .with(counterDelta)
            .select({
              type: sql<IMetricType>`'COUNTER'`.as("type"),
              // orgId: counterDelta.orgId,
              metricId: counterDelta.metricId,
              bucket: counterDelta.bucket,
              valueCount: counterDelta.valueCount,
              value: counterDelta.value,
            })
            .from(counterDelta),
        ),
    );
  }
}
