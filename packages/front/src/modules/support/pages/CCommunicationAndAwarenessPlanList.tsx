import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
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

import { usePlanTypeMap } from "../hooks/usePlanTypeMap";
import { IDtoCommunicationAndAwarenessPlanResponse } from "../interfaces/IDtoCommunicationAndAwarenessPlan";

export function CCommunicationAndAwarenessPlanList() {
  const { t } = useTranslation();
  const planTypeMap = usePlanTypeMap();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("communicationAndAwarenessPlans") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/communication-awareness-plan/item");
  }, []);

  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoCommunicationAndAwarenessPlanResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.action }),
        async () => {
          const res = await Api.DELETE(
            "/u/support/communication-awareness-plan/item/{id}",
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
      { label: t("action") },
      { label: t("information"), hideSm: true },
      { label: t("type"), hideMd: true },
      { label: t("releasedAt"), hideLg: true },
      { label: t("releaseLocations"), hideLg: true },
      { label: t("targetUsers"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  const actions = (
    <CLine className="space-x-2">
      <CLinkAdd path="/supporting-operations/communication-awareness-plan/item-add" />
      <CButtonRefresh onClick={load} />
    </CLine>
  );

  const tableContent = (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <CTable header={header}>
          {payload?.records.map((d) => [
            d.action,
            d.information,

            <CBadge key="type" value={planTypeMap[d.type].label} />,
            <CDisplayDate key="releasedAt" value={d.releasedAt} />,

            <CGridBadge key="releaseLocations">
              {d.releaseLocations.map((location, idx) => (
                <CBadge key={idx} value={location} />
              ))}
            </CGridBadge>,

            <CGridBadge key="targetUsers">
              {d.targetUsers.map((user) => (
                <CBadgeUser key={user.id} value={user.displayName} />
              ))}
            </CGridBadge>,

            <CLine key="actions" className="justify-end space-x-2">
              <CLink
                icon={Pencil}
                path={`/supporting-operations/communication-awareness-plan/item/${d.id}`}
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
