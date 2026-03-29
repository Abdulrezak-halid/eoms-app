
import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgeUnitGroup } from "@m/base/components/CBadgeUnitGroup";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CHighlightedMatchText } from "@m/core/components/CHighlightedMatchText";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoMetricResponse } from "../interfaces/IDtoMetric";
import { CBadgeInboundIntegrationType } from "./CBadgeInboundIntegrationType";
import { CBadgeMetricType } from "./CBadgeMetricType";
import { CBadgeOutboundIntegrationType } from "./CBadgeOutboundIntegrationType";

export function CMetricCardBody({
  data,
  includeDescription,
  searchQuery,
}: {
  data: IDtoMetricResponse;
  includeDescription?: boolean;
  searchQuery?: string;
}) {
  const { t } = useTranslation();

  const { abbr, multiplier } = useUnitInfo(data.unitGroup);

  return (
    <div className="flex justify-between flex-col @md:flex-row @md:items-center @md:space-x-4">
      <div className="min-w-0">
        <div className="font-bold grow truncate">
          <CHighlightedMatchText value={data.name} query={searchQuery} />
        </div>

        <div className="flex flex-wrap space-x-2">
          {data.lastValue !== null && <CMutedText>{t("lastValue")}</CMutedText>}

          <div className="grow space-x-2">
            {data.lastValue !== null ? (
              <>
                <CDisplayNumber
                  value={data.lastValue * multiplier}
                  unitStr={abbr}
                />
                <CDisplayDateAgo value={data.lastValueDatetime} />
              </>
            ) : (
              <CMutedText value={t("noValue")} />
            )}
          </div>
        </div>

        {includeDescription && (
          <div>
            <CMutedText>{t("description")}</CMutedText>

            <div className="whitespace-pre-line">
              {data.description || <CMutedText value="-" />}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col @md:items-end @md:space-y-2">
        <div className="flex flex-col @md:flex-row @md:gap-2 @md:items-center">
          <CMutedText value={t("unit")} />

          <div className="flex space-x-2">
            <CBadgeUnitGroup value={data.unitGroup} />
            <CBadgeMetricType value={data.type} />
          </div>
        </div>

        <div className="flex flex-col @md:flex-row @md:gap-2 @md:items-center">
          <CMutedText value={t("integration")} />

          <div>
            {data.outboundIntegration ? (
              <CBadgeOutboundIntegrationType
                value={data.outboundIntegration.type}
              />
            ) : data.inboundIntegration ? (
              <CBadgeInboundIntegrationType
                value={data.inboundIntegration.type}
              />
            ) : (
              <CBadgeNotConfigured />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
