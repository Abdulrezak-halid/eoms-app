import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IWeatherApiOutputType } from "../interfaces/IWeatherApiOutputType";

export function useWeatherApiOutputTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IWeatherApiOutputType>>(
    () => ({
      CDD: { label: t("cdd") },
      HDD: { label: t("hdd") },
      HUMIDITY: { label: t("humidity") },
      TEMPERATURE: { label: t("temperature") },
      RAIN: { label: t("rain") },
    }),
    [t],
  );
}
