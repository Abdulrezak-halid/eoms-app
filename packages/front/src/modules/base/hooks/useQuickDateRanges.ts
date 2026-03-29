import { UtilDate } from "common";
import { useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

export function useQuickDateRanges() {
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

export type IDateQuickRange = ReturnType<
  typeof useQuickDateRanges
>[number]["value"];

export function isValidDateQuickRange(
  value: unknown,
): value is IDateQuickRange {
  return (
    [
      "TODAY",
      "YESTERDAY",
      "THIS_MONTH",
      "LAST_MONTH",
      "THIS_YEAR",
      "LAST_YEAR",
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

const DateQuickRangeDaysAgo: Partial<Record<IDateQuickRange, number>> = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
  LAST_6_MONTHS: 6 * 30,
  LAST_1_YEAR: 365,
  LAST_2_YEARS: 2 * 365,
  LAST_5_YEARS: 5 * 365,
};

export function getDateRangeFromQuickRange(range: IDateQuickRange): {
  dateMin: string;
  dateMax: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (range) {
    case "TODAY": {
      const d = UtilDate.objToLocalIsoDate(today);
      return { dateMin: d, dateMax: d };
    }
    case "YESTERDAY": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const d = UtilDate.objToLocalIsoDate(yesterday);
      return { dateMin: d, dateMax: d };
    }
    case "THIS_MONTH": {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        dateMin: UtilDate.objToLocalIsoDate(first),
        dateMax: UtilDate.objToLocalIsoDate(last),
      };
    }
    case "LAST_MONTH": {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        dateMin: UtilDate.objToLocalIsoDate(first),
        dateMax: UtilDate.objToLocalIsoDate(last),
      };
    }
    case "THIS_YEAR": {
      const first = new Date(today.getFullYear(), 0, 1);
      const last = new Date(today.getFullYear(), 11, 31);
      return {
        dateMin: UtilDate.objToLocalIsoDate(first),
        dateMax: UtilDate.objToLocalIsoDate(last),
      };
    }
    case "LAST_YEAR": {
      const first = new Date(today.getFullYear() - 1, 0, 1);
      const last = new Date(today.getFullYear() - 1, 11, 31);
      return {
        dateMin: UtilDate.objToLocalIsoDate(first),
        dateMax: UtilDate.objToLocalIsoDate(last),
      };
    }
    case "LAST_7_DAYS":
    case "LAST_30_DAYS":
    case "LAST_90_DAYS":
    case "LAST_6_MONTHS":
    case "LAST_1_YEAR":
    case "LAST_2_YEARS":
    case "LAST_5_YEARS": {
      const days = DateQuickRangeDaysAgo[range] || 0;
      const from = new Date(today);
      from.setDate(from.getDate() - days);
      return {
        dateMin: UtilDate.objToLocalIsoDate(from),
        dateMax: UtilDate.objToLocalIsoDate(today),
      };
    }
  }
}
