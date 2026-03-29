import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CShowMore } from "@m/base/components/CShowMore";
import { CBadge } from "@m/core/components/CBadge";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { useWeatherApiOutputTypeMap } from "../hooks/useWeatherApiOutputTypeMap";
import { IDtoOutboundIntegrationResponse } from "../interfaces/IDtoOutboundIntegration";
import { IWeatherApiOutputType } from "../interfaces/IWeatherApiOutputType";
import { CBadgeMetric } from "./CBadgeMetric";
import { CBadgeMetricIntegrationPeriod } from "./CBadgeMetricIntegrationPeriod";
import { CBadgeOutboundIntegrationType } from "./CBadgeOutboundIntegrationType";

export function COutboundIntegrationOutputCardBody({
  data,
}: {
  data: IDtoOutboundIntegrationResponse;
}) {
  const { t } = useTranslation();
  const mapWeatherOutput = useWeatherApiOutputTypeMap();

  return (
    <div className="flex flex-col @sm:flex-row @sm:items-start justify-between grow gap-y-2 gap-x-4">
      <CLine className="@sm:w-1/4">
        <div className="flex-1 space-y-2">
          <div>
            <CBadgeOutboundIntegrationType value={data.config.type} />
          </div>

          <div>
            <CBadgeMetricIntegrationPeriod value={data.config.period} />
          </div>
        </div>
      </CLine>

      <div className="flex-1 @md:order-none order-last">
        <CMutedText value={t("outputs")} />
        <div className="flex-1">
          {data.outputs.length === 0 ? (
            <CBadgeNotConfigured />
          ) : (
            <CShowMore>
              <div className="space-y-2">
                {data.outputs.map((output) => (
                  <CGridBadge key={output.outputKey}>
                    {(data.config.type === "WEATHER_API" ||
                      data.config.type === "OPEN_WEATHER") && (
                      <CBadge
                        value={
                          mapWeatherOutput[
                            output.outputKey as IWeatherApiOutputType
                          ].label
                        }
                      />
                    )}
                    <CBadgeMetric value={output.metricName} />
                    <CBadgeUnit value={output.unit} />
                  </CGridBadge>
                ))}
              </div>
            </CShowMore>
          )}
        </div>
      </div>
    </div>
  );
}
