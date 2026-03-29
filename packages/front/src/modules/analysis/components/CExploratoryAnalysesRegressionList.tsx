import { ChartLine, RefreshCcw, Trash2 } from "lucide-react";
import { useCallback, useContext } from "react";

import { Api } from "@m/base/api/Api";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CDisplayDatetime } from "@m/base/components/CDisplayDatetime";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader, IAsyncData } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBadgeMeterSlice } from "@m/measurement/components/CBadgeMeterSlice";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";

import { IDtoRegressionResultItem } from "../interfaces/IDtoExploratoryAnalyses";

interface IProps {
  data: IAsyncData<IDtoRegressionResultItem[]>;
  selectedResult: IDtoRegressionResultItem | null;
  reload: () => Promise<void>;
  onResultSelect: (result: IDtoRegressionResultItem | null) => void;
  onRerun: (item: IDtoRegressionResultItem) => void;
}

export function CExploratoryAnalysesRegressionList({
  data,
  selectedResult,
  reload,
  onResultSelect,
  onRerun,
}: IProps) {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);

  const handleRerun = useCallback(
    (item: IDtoRegressionResultItem) => {
      if (!item.meterSlices.length || !item.driver) {
        return;
      }
      onRerun(item);
    },
    [onRerun],
  );

  const handleDelete = useCallback(
    async (item: IDtoRegressionResultItem) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: item.meterSlices.map((s) => s.name).join(", "),
        }),
        async () => {
          const res = await Api.DELETE(
            "/u/analysis/linear-regression/results/{resultId}",
            {
              params: { path: { resultId: item.id } },
            },
          );
          if (res.error) {
            apiToast(res);
            return;
          }
          if (selectedResult?.id === item.id) {
            onResultSelect(null);
          }

          await reload();
        },
      );
    },
    [push, t, selectedResult?.id, reload, apiToast, onResultSelect],
  );

  return (
    <CAsyncLoader data={data}>
      {(payload) => {
        return (
          payload.length > 0 && (
            <div className="flex flex-col space-y-4">
              {payload.map((result) => (
                <CCard key={result.id} className="p-3 space-y-4">
                  <div className="flex justify-end">
                    <div className="flex space-x-2">
                      <CButton
                        icon={RefreshCcw}
                        label={t("rerun")}
                        onClick={handleRerun}
                        value={result}
                        hideLabelLg
                      />
                      <CButton
                        icon={Trash2}
                        label={t("_delete")}
                        onClick={handleDelete}
                        value={result}
                        hideLabelLg
                      />
                      <CButton
                        icon={ChartLine}
                        label={t("view")}
                        primary={result.id === selectedResult?.id}
                        onClick={onResultSelect}
                        value={result}
                        hideLabelLg
                      />
                    </div>
                  </div>

                  <div className="flex flex-col @md:flex-row justify-between gap-4">
                    <div className="flex flex-col space-y-2 @md:w-1/3">
                      <CGridBadge>
                        <CBadgeMetric value={result.driver.name} />
                      </CGridBadge>
                      <CGridBadge>
                        {result.meterSlices.map((s) => (
                          <CBadgeMeterSlice key={s.id} value={s.name} />
                        ))}
                      </CGridBadge>
                    </div>

                    <div className="flex flex-col space-y-2 @md:w-1/3">
                      <div className="space-x-1">
                        <CMutedText>{t("startDate")} </CMutedText>
                        <CDisplayDatetime value={result.datetimeStart} />
                      </div>

                      <div className="space-x-1">
                        <CMutedText>{t("endDate")} </CMutedText>
                        <CDisplayDatetime value={result.datetimeEnd} />
                      </div>

                      <div className="space-x-1">
                        <CMutedText>{t("createdAt")} </CMutedText>
                        <CDisplayDateAgo value={result.createdAt} />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 @md:w-1/3">
                      <div className="flex items-center space-x-1">
                        <CMutedText>
                          R<sup>2</sup>
                        </CMutedText>
                        <span>{result.rSquared.toFixed(3)}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <CMutedText>{t("slope")}</CMutedText>
                        <span>{result.slope.toFixed(3)}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <CMutedText>{t("intercept")}</CMutedText>
                        <span>{result.intercept.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </CCard>
              ))}
            </div>
          )
        );
      }}
    </CAsyncLoader>
  );
}
