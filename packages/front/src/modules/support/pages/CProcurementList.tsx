import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBodyWithQdmsIntegration } from "@m/document-management/components/CBodyWithQdmsIntegration";

import { IDtoProcurementResponse } from "../interfaces/IDtoProcurement";

export function CProcurementList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("procurements") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/procurement/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoProcurementResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.product }),
        async () => {
          const res = await Api.DELETE("/u/support/procurement/item/{id}", {
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

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("product") },
      { label: t("category"), hideSm: true },
      { label: t("criteriaList"), hideMd: true },
      {
        label: t("suggestedBrand") + " / " + t("additionalSpecifications"),
        hideLg: true,
      },
      {
        label:
          t("price") +
          " / " +
          t("annualMaintenanceCost") +
          " / " +
          t("lifetimeYears"),
        hideLg: true,
        noClampLine: true,
      },
      { label: "", right: true },
    ],
    [t],
  );

  const actions = (
    <CLine className="space-x-2">
      <CLinkAdd path="/supporting-operations/procurement/item-add" />
      <CButtonRefresh onClick={load} />
    </CLine>
  );

  const tableContent = (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <CTable header={header}>
          {payload?.records.map((d) => [
            d.product,
            d.category,
            d.criteriaList,

            <div key="brand">
              <div className="line-clamp-2 @sm:line-clamp-3">
                {d.suggestedBrand}
              </div>
              <CHr className="mt-0.5 mb-1" />
              <div className="line-clamp-2 @sm:line-clamp-3 whitespace-pre-line">
                {d.additionalSpecifications}
              </div>
            </div>,

            <div key="costs">
              {d.price}
              <CHr className="mt-0.5 mb-1" />
              {d.annualMaintenanceCost}
              <CHr className="mt-0.5 mb-1" />
              {d.lifetimeYears}
            </div>,

            <CLine key="actions" className="justify-end space-x-2">
              <CLink
                icon={Pencil}
                label={t("edit")}
                path={`/supporting-operations/procurement/item/${d.id}`}
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
  );

  return (
    <CBodyWithQdmsIntegration
      dataQdms={data}
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      {tableContent}
    </CBodyWithQdmsIntegration>
  );
}
