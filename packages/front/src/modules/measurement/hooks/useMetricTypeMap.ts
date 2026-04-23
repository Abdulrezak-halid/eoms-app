import { IDtoEMetricType } from "common/build-api-schema";
import { useMemo } from "react";
import { Gauge, CircleGauge } from "lucide-react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useMetricTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEMetricType>>(
    () => ({
      COUNTER: {
        label: t("counter"),
        icon: CircleGauge,
      },
      GAUGE: {
        label: t("gauge"),
        icon: Gauge,
      },
    }),
    [t],
  );
}
