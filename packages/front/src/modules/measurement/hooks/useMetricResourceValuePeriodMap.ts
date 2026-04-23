import { IDtoEMetricResourceValuePeriod } from "common/build-api-schema";
import { useMemo } from "react";
import { Calendar, CalendarDays, Timer } from "lucide-react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useMetricResourceValuePeriodMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEMetricResourceValuePeriod>>(
    () => ({
      MINUTELY: {
        label: t("minutely"),
        icon: Timer,
      },
      HOURLY: {
        label: t("hourly"),
        icon: Timer,
      },
      DAILY: {
        label: t("daily"),
        icon: Calendar,
      },
      MONTHLY: {
        label: t("monthly"),
        icon: CalendarDays,
      },
    }),
    [t],
  );
}
