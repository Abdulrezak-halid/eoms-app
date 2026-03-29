import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { CBadgeSeu } from "@m/base/components/CBadgeSeu";
import { CBadgeUser } from "@m/base/components/CBadgeUser";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
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

import { IDtoMaintenanceActivityResponse } from "../interfaces/IDtoMaintenanceActivity";

export function CMaintenanceActivityList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("maintenanceActivities") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/support/maintenance-activity/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (records: IDtoMaintenanceActivityResponse) => {
      await push(
        t("msgRecordWillBeDeleted", {
          subject: records.task,
        }),
        async () => {
          const res = await Api.DELETE(
            "/u/support/maintenance-activity/item/{id}",
            {
              params: { path: { id: records.id } },
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
      { label: t("task") },
      { label: t("significantEnergyUsers"), hideSm: true },
      { label: t("period"), hideMd: true },
      { label: t("responsibleUser"), hideLg: true },
      { label: t("lastMaintainedAt"), hideLg: true },
      { label: t("note"), hideLg: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/supporting-operations/maintenance-activity/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable header={header}>
            {payload.records.map((d) => [
              d.task,
              <CBadgeSeu key="seu" value={d.seu.name} />,
              <CBadgePeriod key="period" value={d.period} />,
              <CBadgeUser
                key="responsibleUser"
                value={d.responsibleUser.name}
              />,
              <CDisplayDate
                key="lastMaintainedAt"
                value={d.lastMaintainedAt}
              />,

              d.note || "-",
              <CLine key="actions" className="justify-end space-x-2">
                <CLink
                  icon={Pencil}
                  path={`/supporting-operations/maintenance-activity/item/${d.id}`}
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
