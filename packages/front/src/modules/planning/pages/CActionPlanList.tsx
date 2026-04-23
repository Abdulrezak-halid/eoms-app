import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeApprovementStatus } from "@m/base/components/CBadgeApprovementStatus";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonAddToReport } from "@m/base/components/CButtonAddToReport";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoActionPlanResponse } from "../interfaces/IDtoActionPlan";

export function CActionPlanList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("actionPlans") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/action-plan/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoActionPlanResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE("/u/planning/action-plan/item/{id}", {
            params: { path: { id: record.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [apiToast, load, push, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      {
        label: t("actualSavings") + " / " + t("actualSavingsVerifications"),
        hideSm: true,
        noClampLine: true,
      },
      {
        label: t("reasonsForStatus"),
        hideMd: true,
      },
      {
        label:
          t("startDate") +
          " / " +
          t("targetIdentificationDate") +
          " / " +
          t("actualIdentificationDate"),
        hideLg: true,
      },
      { label: t("responsibleUser"), hideLg: true },
      { label: t("approvementStatus"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CButtonAddToReport sectionType="ACTION_PLANS" />
        <CLinkAdd path="/planning/action-plan/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.name,

              <div key="savings">
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.actualSavings}
                </div>
                <CHr className="mt-0.5 mb-1" />
                <div className="line-clamp-2 @sm:line-clamp-3">
                  {d.actualSavingsVerifications}
                </div>
              </div>,
              <div key="reasons" className="whitespace-pre-line">
                {d.reasonsForStatus}
              </div>,
              <CGridBadge key="dates">
                <CDisplayDate value={d.startDate} />
                <CDisplayDate value={d.targetIdentificationDate} />
                <CDisplayDate value={d.actualIdentificationDate} />
              </CGridBadge>,

              <CBadgeUser
                key="responsibleUser"
                value={d.responsibleUser.displayName}
              />,

              <CBadgeApprovementStatus
                key="approvementStatus"
                value={d.approvementStatus}
              />,

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  label={t("edit")}
                  path={`/planning/action-plan/item/${d.id}`}
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
