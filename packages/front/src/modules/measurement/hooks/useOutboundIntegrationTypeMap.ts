import { IDtoEOutboundIntegrationType } from "common/build-api-schema";
import { Drama } from "lucide-react";
import { useMemo } from "react";

import { IValueLabelMap } from "@m/base/interfaces/IValueLabelMap";
import { TranslationFunc, useTranslation } from "@m/core/hooks/useTranslation";

import logoAveva from "../assets/logo-aveva.webp";
import logoOpenWeather from "../assets/logo-openweather.webp";
import logoWeatherApi from "../assets/logo-weatherapi.webp";

export function renderOutboundIntegrationTypeMap(t: TranslationFunc) {
  return {
    MOCK_SOURCE: { icon: Drama, label: t("mockSource") },
    // Brand names are not translated
    WEATHER_API: { imageSrc: logoWeatherApi, label: "Weather API" },
    OPEN_WEATHER: { imageSrc: logoOpenWeather, label: "Open Weather" },
    AVEVA_PI: { imageSrc: logoAveva, label: "AVEVA PI" },
  };
}

export function useOutboundIntegrationTypeMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEOutboundIntegrationType>>(
    () => renderOutboundIntegrationTypeMap(t),
    [t],
  );
}
