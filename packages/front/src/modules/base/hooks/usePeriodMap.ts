import { IDtoEPeriod } from "common/build-api-schema";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "../interfaces/IValueLabelMap";

export function usePeriodMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEPeriod>>(
    () => ({
      WEEKLY: { label: t("periodWeekly") },
      MONTHLY: { label: t("periodMonthly") },
      QUARTERLY: { label: t("periodQuarterly") },
      YEARLY: { label: t("periodYearly") },
    }),
    [t],
  );
}
