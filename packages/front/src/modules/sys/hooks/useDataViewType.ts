import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDtoEDataViewType } from "@m/measurement/interfaces/IDtoDataViewProfile";

export function useDataViewTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEDataViewType>>(
    () => ({
      METRIC: { label: t("metric") },
      METER_SLICE: { label: t("meter") },
      SEU: { label: t("significantEnergyUser") },
    }),
    [t],
  );
}
