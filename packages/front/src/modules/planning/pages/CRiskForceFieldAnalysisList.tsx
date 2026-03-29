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
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoRiskForceFieldAnalysisResponse } from "../interfaces/IDtoRiskForceFieldAnalysis";

export function CRiskForceFieldAnalysisList() {
  const { t } = useTranslation();
  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("forceFieldAnalyses"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/risk-force-field-analysis/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoRiskForceFieldAnalysisResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.parameter }),
        async () => {
          const res = await Api.DELETE(
            "/u/planning/risk-force-field-analysis/item/{id}",
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
      { label: t("parameter") },
      { label: t("score"), hideSm: true },
      { label: t("solutions"), hideMd: true },
      {
        label: t("completedAt") + " / " + t("estimatedCompletionDate"),
        hideLg: true,
      },
      { label: t("responsibleUser"), hideLg: true },
      {
        label:
          t("isSucceed") +
          " / " +
          t("isFollowUpRequired") +
          " / " +
          t("isActionRequired"),
        hideLg: true,
      },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/planning/risks/force-field-analyses/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.parameter,

              <CBadge key="score" value={d.score.toString()} />,

              <div key="solutions" className="whitespace-pre-line">
                {d.solutions}
              </div>,

              <CGridBadge key="dates">
                <CDisplayDate value={d.completedAt} />
                <CDisplayDate value={d.estimatedCompletionDate} />
              </CGridBadge>,

              <CBadgeUser
                key="responsibleUser"
                value={d.responsibleUser.displayName}
              />,

              <CGridBadge key="dates">
                <CBadgeYesNo value={d.isSucceed} />
                <CHr className="mt-0.5 mb-1" />
                <CBadgeYesNo value={d.isFollowUpRequired} />
                <CHr className="mt-0.5 mb-1" />
                <CBadgeYesNo value={d.isActionRequired} />
              </CGridBadge>,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/planning/risks/force-field-analyses/item/${d.id}`}
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
