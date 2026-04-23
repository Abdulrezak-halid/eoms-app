import {
  doublePrecision,
  integer,
  pgView,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

function genViewGauge<T extends string>(suffix: T) {
  return pgView(`vw_metric_resource_values_gauge_${suffix}`, {
    orgId: uuid().notNull(),
    resourceId: uuid().notNull(),
    bucket: timestamp({ mode: "string" }).notNull(),
    valueCount: integer().notNull(),
    valueAvg: doublePrecision().notNull(),
  }).existing();
}

function genViewCounterCumulative<T extends string>(suffix: T) {
  return pgView(`vw_metric_resource_values_counter_cumulative_${suffix}`, {
    orgId: uuid().notNull(),
    resourceId: uuid().notNull(),
    bucket: timestamp({ mode: "string" }).notNull(),
    valueCount: integer().notNull(),
    valueMax: doublePrecision().notNull(),
  }).existing();
}

export const VwMetricResourceValueGaugeMinutely = genViewGauge("minutely");
export const VwMetricResourceValueGaugeHourly = genViewGauge("hourly");
export const VwMetricResourceValueGaugeDaily = genViewGauge("daily");
export const VwMetricResourceValueGaugeMonthly = genViewGauge("monthly");

export const VwMetricResourceValueCounterCumulativeMinutely =
  genViewCounterCumulative("minutely");
export const VwMetricResourceValueCounterCumulativeHourly =
  genViewCounterCumulative("hourly");
export const VwMetricResourceValueCounterCumulativeDaily =
  genViewCounterCumulative("daily");
export const VwMetricResourceValueCounterCumulativeMonthly =
  genViewCounterCumulative("monthly");
