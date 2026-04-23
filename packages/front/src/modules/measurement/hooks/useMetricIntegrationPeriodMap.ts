import { IDtoEMetricIntegrationPeriod } from "common/build-api-schema";
import { useMemo } from "react";
import { Calendar, CalendarDays, Timer } from "lucide-react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useMetricIntegrationPeriodMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEMetricIntegrationPeriod>>(
    () => ({
      MINUTELY: {
        label: t("minutely"),
        icon: Timer,
      },
      MINUTELY_5: {
        label: t("fiveMinutely"),
        icon: Timer,
      },
      MINUTELY_15: {
        label: t("fifteenMinutely"),
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
