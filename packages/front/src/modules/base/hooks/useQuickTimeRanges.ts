import { UtilDate } from "common";
import { useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

export function isValidDatetimeQuickRange(
  value: unknown,
): value is IDatetimeQuickRange {
  return (
    [
      "TODAY",
      "YESTERDAY",
      "THIS_MONTH",
      "LAST_MONTH",
      "THIS_YEAR",
      "LAST_YEAR",
      "LAST_12_HOURS",
      "LAST_1_DAY",
      "LAST_2_DAYS",
      "LAST_7_DAYS",
      "LAST_30_DAYS",
      "LAST_90_DAYS",
      "LAST_6_MONTHS",
      "LAST_1_YEAR",
      "LAST_2_YEARS",
      "LAST_5_YEARS",
    ] as readonly string[]
  ).includes(value as string);
}

export function useQuickTimeRanges() {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        { value: "TODAY", label: t("today") },
        { value: "YESTERDAY", label: t("yesterday") },
        { value: "THIS_MONTH", label: t("thisMonth") },
        { value: "LAST_MONTH", label: t("lastMonth") },
        { value: "THIS_YEAR", label: t("thisYear") },
        { value: "LAST_YEAR", label: t("lastYear") },

        { value: "LAST_12_HOURS", label: t("last12Hours") },
        { value: "LAST_1_DAY", label: t("last1Day") },
        { value: "LAST_2_DAYS", label: t("last2Days") },
        { value: "LAST_7_DAYS", label: t("last7Days") },
        { value: "LAST_30_DAYS", label: t("last30Days") },
        { value: "LAST_90_DAYS", label: t("last90Days") },
        { value: "LAST_6_MONTHS", label: t("last6Months") },
        { value: "LAST_1_YEAR", label: t("last1Year") },
        { value: "LAST_2_YEARS", label: t("last2Years") },
        { value: "LAST_5_YEARS", label: t("last5Years") },
      ] as const,
    [t],
  );
}

export type IDatetimeQuickRange = ReturnType<
  typeof useQuickTimeRanges
>[number]["value"];

export const DataRangeLastToMinutes: Partial<
  Record<IDatetimeQuickRange, number>
> = {
  LAST_12_HOURS: 720,
  LAST_1_DAY: 1440,
  LAST_2_DAYS: 2880,
  LAST_7_DAYS: 7 * 1440,
  LAST_30_DAYS: 30 * 1440,
  LAST_90_DAYS: 90 * 1440,
  LAST_6_MONTHS: 6 * 30 * 1440,
  LAST_1_YEAR: 365 * 1440,
  LAST_2_YEARS: 2 * 365 * 1440,
  LAST_5_YEARS: 5 * 365 * 1440,
};

export function getDatetimeRangeFromQuickRange(range: IDatetimeQuickRange) {
  let datetimeMin = "";
  let datetimeMax = "";

  switch (range) {
    case "TODAY": {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setDate(date.getDate() + 1);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "YESTERDAY": {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setDate(date.getDate() - 1);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setDate(date.getDate() + 1);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "THIS_MONTH": {
      const date = new Date();
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setUTCMonth(date.getUTCMonth() + 1);
      date.setUTCDate(0);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "LAST_MONTH": {
      const date = new Date();
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      date.setUTCMonth(date.getUTCMonth() - 1);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setUTCMonth(date.getUTCMonth() + 1);
      date.setUTCDate(0);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "THIS_YEAR": {
      const date = new Date();
      date.setUTCMonth(0);
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      date.setUTCMonth(-1);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "LAST_YEAR": {
      const date = new Date();
      date.setUTCMonth(0);
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      date.setUTCFullYear(date.getUTCFullYear() - 1);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      date.setUTCMonth(-1);
      datetimeMax = UtilDate.objToIsoDatetime(date);
      break;
    }
    case "LAST_12_HOURS":
    case "LAST_1_DAY":
    case "LAST_2_DAYS":
    case "LAST_7_DAYS":
    case "LAST_30_DAYS":
    case "LAST_90_DAYS":
    case "LAST_6_MONTHS":
    case "LAST_1_YEAR":
    case "LAST_2_YEARS":
    case "LAST_5_YEARS": {
      const minutes = DataRangeLastToMinutes[range] || 0;
      const date = new Date();
      datetimeMax = UtilDate.objToIsoDatetime(date);
      date.setMinutes(date.getMinutes() - minutes);
      datetimeMin = UtilDate.objToIsoDatetime(date);
      break;
    }
    default:
      break;
  }

  return {
    datetimeMin,
    datetimeMax,
  };
}
