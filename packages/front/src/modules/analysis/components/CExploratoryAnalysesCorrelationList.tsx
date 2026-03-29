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
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";

import {
  IDtoCorrelationResultItem,
  IDtoCorrelationResults,
} from "../interfaces/IDtoExploratoryAnalyses";

interface IProps {
  data: IAsyncData<IDtoCorrelationResults>;
  selectedResult: IDtoCorrelationResultItem | null;
  reload: () => Promise<void>;
  onResultSelect: (result: IDtoCorrelationResultItem | null) => void;
  onRerun: (item: IDtoCorrelationResultItem) => void;
}

export function CExploratoryAnalysesCorrelationList({
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
    (item: IDtoCorrelationResultItem) => {
      if (!item.metrics.length) {
        return;
      }
      onRerun(item);
    },
    [onRerun],
  );

  const handleDelete = useCallback(
    async (item: IDtoCorrelationResultItem) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: item.metrics.map((s) => s.name).join(", "),
        }),
        async () => {
          const res = await Api.DELETE(
            "/u/analysis/correlation/results/{resultId}",
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
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => {
        return (
          payload.records.length > 0 && (
            <div className="flex flex-col space-y-4">
              {payload.records.map((result) => (
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
                        primary={result.id === selectedResult?.id}
                        icon={ChartLine}
                        label={t("view")}
                        onClick={onResultSelect}
                        value={result}
                        hideLabelLg
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <CGridBadge>
                      {result.metrics.map((s) => (
                        <CBadgeMetric key={s.id} value={s.name} />
                      ))}
                    </CGridBadge>
                  </div>

                  <div className="flex flex-col @md:flex-row flex-wrap justify-between grow gap-x-4 gap-y-4">
                    <div>
                      <CMutedText>{t("startDate")}</CMutedText>
                      <div>
                        <CDisplayDatetime value={result.datetimeStart} />
                      </div>
                    </div>

                    <div>
                      <CMutedText>{t("endDate")}</CMutedText>
                      <div>
                        <CDisplayDatetime value={result.datetimeEnd} />
                      </div>
                    </div>

                    <div className="text-right @md:text-left">
                      <CMutedText>{t("createdAt")}</CMutedText>
                      <div>
                        <CDisplayDateAgo value={result.createdAt} />
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
