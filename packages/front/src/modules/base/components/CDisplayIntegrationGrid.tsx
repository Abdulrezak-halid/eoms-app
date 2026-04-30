import { Drama, FileDown, Webhook } from "lucide-react";
import { useMemo } from "react";

import { CDisplayImage } from "@m/base/components/CDisplayImage";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIconOrCustom } from "@m/core/components/CIcon";
import { useTranslation } from "@m/core/hooks/useTranslation";

import logoAveva from "../../measurement/assets/logo-aveva.webp";
import logoOpenWeather from "../../measurement/assets/logo-openweather.webp";
import logoeomsAgent from "../../measurement/assets/logo-eomsagent.webp";
import logoWeatherApi from "../../measurement/assets/logo-weatherapi.webp";

export function CDisplayIntegrationGrid() {
  const { t } = useTranslation();

  const list = useMemo(
    () => [
      { value: "WEATHER_API", imageSrc: logoWeatherApi, label: "Weather API" },
      {
        value: "OPEN_WEATHER",
        imageSrc: logoOpenWeather,
        label: "Open Weather",
      },
      { value: "AVEVA_PI", imageSrc: logoAveva, label: "AVEVA PI" },
      { value: "WEBHOOK", icon: Webhook, label: t("webhook") },
      { value: "AGENT", imageSrc: logoeomsAgent, label: t("agent") },
      { value: "QDMS", icon: FileDown, label: t("qdmsShort") },
      { value: "MOCK_SOURCE", icon: Drama, label: t("mockSource") },
    ],
    [t],
  );

  return (
    <CGridBadge>
      {list.map((d) => (
        <div
          key={d.value}
          className="text-center flex flex-col space-y-3 justify-center items-center rounded-md shadow-sm bg-white dark:bg-gray-700 p-3 w-36"
          title={d.label}
        >
          <div className="rounded-sm w-full h-12 flex-none flex justify-center items-center">
            {d.icon ? (
              <CIconOrCustom value={d.icon} className="w-10! h-10!" />
            ) : (
              d.imageSrc && (
                <CDisplayImage
                  className="max-w-full max-h-full"
                  src={d.imageSrc}
                  alt={d.label}
                />
              )
            )}
          </div>
          <div className="font-bold">{d.label}</div>
        </div>
      ))}
    </CGridBadge>
  );
}
