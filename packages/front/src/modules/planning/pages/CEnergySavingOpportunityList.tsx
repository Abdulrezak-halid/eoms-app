import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeApprovementStatus } from "@m/base/components/CBadgeApprovementStatus";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
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

import { IDtoEnergySavingOpportunityResponse } from "../interfaces/IDtoEnergySavingOpportunity";

export function CEnergySavingOpportunityList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("energySavingOpportunities") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/energy-saving-opportunity/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoEnergySavingOpportunityResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/planning/energy-saving-opportunity/item/{id}",
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
    [apiToast, load, push, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      {
        label: t("estimatedSavings"),
        hideSm: true,
      },
      {
        label:
          t("seus") +
          " / " +
          t("responsibleUser") +
          " / " +
          t("approvementStatus"),
        hideSm: true,
      },
      {
        label:
          t("paybackMonth") + " / " + t("investmentApplicationPeriodMonth"),
        hideMd: true,
      },
      {
        label:
          t("investmentBudget") +
          " / " +
          t("estimatedSavings") +
          " / " +
          t("calculationMethodOfPayback"),
        hideLg: true,
      },
      { label: t("notes"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/planning/energy-saving-opportunity/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.name,

              <CGridBadge key="estimatedSavings">
                {d.estimatedSavings.map((saving, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <CBadgeEnergyResource value={saving.energyResource} />

                    <CBadge
                      value={saving.value}
                      noTruncate
                      className="bg-muted/30"
                    />
                  </div>
                ))}
              </CGridBadge>,

              <CGridBadge key="seus">
                {d.seus.map((seu) => (
                  <CBadgeSeu key={seu.id} value={seu.name} />
                ))}
                <CBadgeUser
                  key="responsibleUser"
                  value={d.responsibleUser.displayName}
                />
                <CBadgeApprovementStatus
                  key="approvementStatus"
                  value={d.approvementStatus}
                />
              </CGridBadge>,

              <div key="moneyDetails">
                {t("dynamicMonths", { month: d.paybackMonth })}
                <CHr className="mt-0.5 mb-1" />
                {t("dynamicMonths", {
                  month: d.investmentApplicationPeriodMonth,
                })}
              </div>,

              <div key="budgetDetails">
                {d.investmentBudget}
                <CHr className="mt-0.5 mb-1" />
                {d.estimatedBudgetSaving}
                <CHr className="mt-0.5 mb-1" />
                {d.calculationMethodOfPayback}
              </div>,

              d.notes || "-",

              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  path={`/planning/energy-saving-opportunity/item/${d.id}`}
                  hideLabelLg
                />
                <CButton
                  icon={Trash2}
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
