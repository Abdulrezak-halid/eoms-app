import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoRiskSwotAnalysisResponse } from "../interfaces/IDtoRiskSwotAnalysis";

export function CRiskSwotAnalysisList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("swotAnalyses"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/risk-swot-analysis/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoRiskSwotAnalysisResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.type }),
        async () => {
          const res = await Api.DELETE(
            "/u/planning/risk-swot-analysis/item/{id}",
            {
              params: { path: { id: record.id } },
            },
          );
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("type") },
      { label: t("description"), hideSm: true },
      { label: t("solutions"), hideMd: true },
      {
        label:
          t("createdAt") +
          " / " +
          t("estimatedCompletionDate") +
          " / " +
          t("completedAt"),
        hideLg: true,
      },
      { label: t("responsibleUser"), hideLg: true },
      { label: t("isActionRequired"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/planning/risks/swot-analyses/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.type,

              <div key="description" className="whitespace-pre-line">
                {d.description || "-"}
              </div>,

              <div key="solutions" className="whitespace-pre-line">
                {d.solutions}
              </div>,

              <CGridBadge key="dates">
                <CDisplayDate value={d.analysisCreatedAt} />
                <CDisplayDate value={d.estimatedCompletionDate} />
                <CDisplayDate value={d.completedAt} />
              </CGridBadge>,

              <CBadgeUser
                key="responsibleUser"
                value={d.responsibleUser.displayName}
              />,

              <CBadgeYesNo key="isActionRequired" value={d.isActionRequired} />,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/planning/risks/swot-analyses/item/${d.id}`}
                  hideLabelLg
                />
                <CButton
                  icon={Trash2}
                  label={t("_delete")}
                  value={d}
                  onClick={handleDelete}
                  hideLabelLg
                />
              </CLine>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
