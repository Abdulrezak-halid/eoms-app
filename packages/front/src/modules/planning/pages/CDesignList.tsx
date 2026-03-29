import { Lightbulb, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBodyWithQdmsIntegration } from "@m/document-management/components/CBodyWithQdmsIntegration";

import { IDtoDesignResponse } from "../interfaces/IDtoDesign";

export function CDesignList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("designs") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/planning/design/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoDesignResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE("/u/planning/design/item/{id}", {
            params: { path: { id: record.id } },
          });
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [push, apiToast, load, t],
  );

  const actions = useCallback<IDropdownListCallback<IDtoDesignResponse>>(
    (d) => [
      {
        icon: Lightbulb,
        label: t("ideas"),
        path: `/planning/design/item/${d.id}/idea`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/planning/design/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [t, handleDelete],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("numberShort"), hideSm: true },

      { label: t("purpose") + " / " + t("impact"), hideMd: true },

      {
        label:
          t("estimatedSavings") +
          " / " +
          t("estimatedAdditionalCost") +
          " / " +
          t("estimatedTurnaroundMonths"),
        hideMd: true,
      },

      { label: t("potentialNonEnergyBenefits"), hideLg: true },
      { label: t("numberOfIdeas"), hideLg: true },
      { label: t("projectLeader"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  const actionButtons = useMemo(
    () => (
      <CLine className="space-x-2">
        <CLinkAdd path="/planning/design/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
    ),
    [load],
  );

  const tableContent = (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <CTable noOverflow header={header}>
          {payload?.records.map((d) => [
            d.name,
            d.no,
            <div key="purposeImpact">
              {d.purpose}
              <CHr className="mt-0.5 mb-1" />
              {d.impact}
            </div>,

            <div key="savings">
              {d.estimatedSavings}
              <CHr className="mt-0.5 mb-1" />
              {d.estimatedAdditionalCost}
              <CHr className="mt-0.5 mb-1" />
              {t("dynamicMonths", {
                month: d.estimatedTurnaroundMonths,
              })}
            </div>,
            <div
              key="potentialNonEnergyBenefits"
              className="whitespace-pre-line"
            >
              {d.potentialNonEnergyBenefits}
            </div>,
            d.ideaCount,
            <CBadgeUser key="leaderUser" value={d.leaderUser.displayName} />,
            <div key="actions" className="flex justify-end">
              <CDropdown
                list={actions}
                value={d}
                label={t("actions")}
                hideLabelLg
              />
            </div>,
          ])}
        </CTable>
      )}
    </CAsyncLoader>
  );

  return (
    <CBodyWithQdmsIntegration
      dataQdms={data}
      breadcrumbs={breadcrumbs}
      actions={actionButtons}
    >
      {tableContent}
    </CBodyWithQdmsIntegration>
  );
}
