import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayDatetime } from "@m/base/components/CDisplayDatetime";
import { CBadge } from "@m/core/components/CBadge";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CMutedText } from "@m/core/components/CMutedText";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBadgeMeterSlice } from "@m/measurement/components/CBadgeMeterSlice";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";

import { IDtoAdvancedRegressionResultItem } from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionAnalysesCardBody({
  data,
  includeDetails,
}: {
  data: IDtoAdvancedRegressionResultItem;
  includeDetails?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col @md:flex-row justify-between gap-4">
      <div className="min-w-0 truncate space-y-2">
        <CGridBadge>
          {data.seu ? (
            <CBadgeSeu value={data.seu.name} />
          ) : (
            data.slices.map((slice) => (
              <CBadgeMeterSlice key={slice.id} value={slice.name} />
            ))
          )}
        </CGridBadge>

        <div>
          <CGridBadge>
            {data.drivers.map((d) => (
              <CBadgeMetric key={d.id} value={d.name} />
            ))}
          </CGridBadge>

          {includeDetails && data.primary && (
            <div className="mt-2">
              <CBadge
                value={t("primary")}
                className="text-sky-600 dark:text-sky-300"
              />
            </div>
          )}
        </div>
      </div>

      {includeDetails && (
        <div className="flex flex-col space-y-1 whitespace-nowrap max-w-min">
          <div className="space-x-2 flex justify-between">
            <CMutedText>{t("dateTrainStart")}</CMutedText>
            <CDisplayDatetime value={data.dateTrainStart} />
          </div>

          <div className="space-x-2 flex justify-between">
            <CMutedText>{t("dateTrainEnd")}</CMutedText>
            <CDisplayDatetime value={data.dateTrainEnd} />
          </div>

          <div className="space-x-2 flex justify-between">
            <CMutedText>{t("datePredictStart")}</CMutedText>
            <CDisplayDatetime value={data.datePredictStart} />
          </div>

          <div className="space-x-2 flex justify-between">
            <CMutedText>{t("datePredictEnd")}</CMutedText>
            <CDisplayDatetime value={data.datePredictEnd} />
          </div>
        </div>
      )}

      <div className="flex flex-col @md:items-end @md:space-y-1">
        <div className="flex flex-col @md:flex-row @md:gap-2 @md:items-center">
          <div className="space-x-1">
            <CMutedText>
              R<sup>2</sup>
            </CMutedText>
            <CDisplayNumber value={data.rSquared} />
          </div>

          <div className="space-x-1">
            <CMutedText>RMSE</CMutedText>
            <CDisplayNumber value={data.rmse} />
          </div>
        </div>

        <div className="flex flex-col @md:flex-row @md:gap-2 @md:items-center">
          <div className="flex items-center gap-1">
            <CMutedText>{t("createdAt")}</CMutedText>
            <CDisplayDateAgo value={data.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}
