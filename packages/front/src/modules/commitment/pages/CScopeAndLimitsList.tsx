import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeDepartment } from "@m/base/components/CBadgeDepertment";
import { CBadgeEnergyResource } from "@m/base/components/CBadgeEnergyResource";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBodyWithQdmsIntegration } from "@m/document-management/components/CBodyWithQdmsIntegration";

import { IDtoScopeAndLimitsResponse } from "../interfaces/IDtoScopeAndLimits";

export function CScopeAndLimitsList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("scopeAndLimits") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/commitment/scope-and-limit/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoScopeAndLimitsResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.physicalLimits }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/scope-and-limit/item/{id}",
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
      { label: t("physicalLimits") },
      { label: t("excludedResourceReason"), hideLg: true },
      { label: t("excludedResources") },
      { label: t("products"), hideLg: true },
      { label: t("departments"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  const actions = useMemo(
    () => (
      <CLine className="space-x-2">
        <CLinkAdd path="/commitment/scope-and-limit/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
    ),
    [load],
  );

  const tableContent = (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <CTable header={header}>
          {payload?.records.map((d) => [
            d.physicalLimits,
            <div key="excludedResourceReason" className="whitespace-pre-line">
              {d.excludedResourceReason}
            </div>,
            d.excludedResourceReason,
            <CGridBadge key="excludedResources">
              {d.excludedResources.map((resource) => (
                <CBadgeEnergyResource key={resource} value={resource} />
              ))}
            </CGridBadge>,
            <CGridBadge key="products">
              {d.products.map((product) => (
                <CBadge key={product} value={product} wrap />
              ))}
            </CGridBadge>,
            <CGridBadge key="departments">
              {d.departments.map((department) => (
                <CBadgeDepartment
                  key={department.id}
                  value={department.name}
                  wrap
                />
              ))}
            </CGridBadge>,
            <CLine key="actions" className="justify-end space-x-2">
              <CLink
                icon={Pencil}
                label={t("edit")}
                path={`/commitment/scope-and-limit/item/${d.id}`}
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
