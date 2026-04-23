import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useMonthNames() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      t("monthJanuary"),
      t("monthFebruary"),
      t("monthMarch"),
      t("monthApril"),
      t("monthMay"),
      t("monthJune"),
      t("monthJuly"),
      t("monthAugust"),
      t("monthSeptember"),
      t("monthOctober"),
      t("monthNovember"),
      t("monthDecember"),
    ],
    [t],
  );
}

export function useDayNames() {
  const { t } = useTranslation();

  return useMemo(
    () => [
      t("daySunCapital"),
      t("dayMonCapital"),
      t("dayTueCapital"),
      t("dayWedCapital"),
      t("dayThuCapital"),
      t("dayFriCapital"),
      t("daySatCapital"),
    ],
    [t],
  );
}
