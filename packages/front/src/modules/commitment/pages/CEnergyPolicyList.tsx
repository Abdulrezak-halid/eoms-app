import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonAddToReport } from "@m/base/components/CButtonAddToReport";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBodyWithQdmsIntegration } from "@m/document-management/components/CBodyWithQdmsIntegration";

import { IDtoEnergyPolicyResponse } from "../interfaces/IDtoEnergyPolicy";

export function CEnergyPolicyList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("energyPolicies"),
      },
    ],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/commitment/energy-policy/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoEnergyPolicyResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.content }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/energy-policy/item/{id}",
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
      { label: t("content") },
      { label: t("type"), hideMd: true },
      { label: t("target"), hideLg: true },
      { label: t("period"), hideSm: true, right: true },
      { label: "", right: true },
    ],
    [t],
  );

  const actions = useMemo(
    () => (
      <CLine className="space-x-2">
        <CButtonAddToReport sectionType="ENERGY_POLICIES" />
        <CLinkAdd path="/commitment/energy-policies/item-add" />
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
            <div key="content" className="whitespace-pre-line">
              {d.content}
            </div>,
            d.type || "-",
            d.target || "-",
            <CBadgePeriod key="period" value={d.period} />,
            <CLine key="actions" className="justify-end space-x-2">
              <CLink
                icon={Pencil}
                label={t("edit")}
                path={`/commitment/energy-policies/item/${d.id}`}
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
