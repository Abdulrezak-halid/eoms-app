import { EApiFailCode } from "common";
import { ColumnBaseConfig, SQL, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IMetricIntegrationPeriod } from "../interfaces/IMetricIntegrationPeriod";
import { IMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";
import {
  VwMetricResourceValueCounterCumulativeDaily,
  VwMetricResourceValueCounterCumulativeHourly,
  VwMetricResourceValueCounterCumulativeMinutely,
  VwMetricResourceValueCounterCumulativeMonthly,
  VwMetricResourceValueGaugeDaily,
  VwMetricResourceValueGaugeHourly,
  VwMetricResourceValueGaugeMinutely,
  VwMetricResourceValueGaugeMonthly,
} from "../orm/VwMetricResourceValueAggregated";

export namespace UtilMetricResourceValuePeriod {
  export function truncExpr(
    datetimeColumn:
      | SQL<unknown>
      | PgColumn<ColumnBaseConfig<"string", "PgTimestampString">>,
    period: IMetricResourceValuePeriod,
  ) {
    const periodToSqlMap: Record<IMetricResourceValuePeriod, string> = {
      MINUTELY: "MINUTE",
      HOURLY: "HOUR",
      DAILY: "DAY",
      MONTHLY: "MONTH",
    } as const;

    return sql`DATE_TRUNC(${periodToSqlMap[period]}, ${datetimeColumn})`;
  }

  export function getCronExpression(period: IMetricIntegrationPeriod): string {
    switch (period) {
      case "MINUTELY":
        return "* * * * *";
      case "MINUTELY_5":
        return "*/5 * * * *";
      case "MINUTELY_15":
        return "*/15 * * * *";
      case "HOURLY":
        return "0 * * * *";
      case "DAILY":
        return "0 0 * * *";
      case "MONTHLY":
        return "0 0 1 * *";
    }
  }

  export function getViewMetricResourceValueGauge(
    period: IMetricResourceValuePeriod,
  ) {
    switch (period) {
      case "MINUTELY":
        return VwMetricResourceValueGaugeMinutely;
      case "HOURLY":
        return VwMetricResourceValueGaugeHourly;
      case "DAILY":
        return VwMetricResourceValueGaugeDaily;
      case "MONTHLY":
        return VwMetricResourceValueGaugeMonthly;
    }
  }

  export function getViewMetricResourceValueCounterCumulative(
    period: IMetricResourceValuePeriod,
  ) {
    switch (period) {
      case "MINUTELY":
        return VwMetricResourceValueCounterCumulativeMinutely;
      case "HOURLY":
        return VwMetricResourceValueCounterCumulativeHourly;
      case "DAILY":
        return VwMetricResourceValueCounterCumulativeDaily;
      case "MONTHLY":
        return VwMetricResourceValueCounterCumulativeMonthly;
    }
  }

  export function getDbInterval(period: IMetricResourceValuePeriod) {
    switch (period) {
      case "MINUTELY":
        return { plain: "1 minute", str: "'1' minute" };
      case "HOURLY":
        return { plain: "1 hour", str: "'1' hour" };
      case "DAILY":
        return { plain: "1 day", str: "'1' day" };
      case "MONTHLY":
        return { plain: "1 month", str: "'1' month" };
    }
  }

  export function detectPeriod(
    datetimeStart: string,
    datetimeEnd: string,
    lowResolutionMode?: boolean,
  ): IMetricResourceValuePeriod {
    const start = new Date(datetimeStart);
    const end = new Date(datetimeEnd);

    if (start > end) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "First date cannot greater than second date.",
      );
    }

    const dateDiffMs = Math.abs(end.getTime() - start.getTime());
    const dateDiffHours = dateDiffMs / (1000 * 60 * 60);
    const dateDiffDays = dateDiffHours / 24;
    const dateDiffMonths =
      end.getFullYear() * 12 +
      end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth());

    if (lowResolutionMode) {
      return dateDiffMonths >= 6
        ? "MONTHLY"
        : dateDiffDays > 7
          ? "DAILY"
          : dateDiffHours >= 6
            ? "HOURLY"
            : "MINUTELY";
    }

    return dateDiffMonths >= 10
      ? "MONTHLY"
      : dateDiffDays > 7
        ? "DAILY"
        : dateDiffHours > 12
          ? "HOURLY"
          : "MINUTELY";
  }
}
