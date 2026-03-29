import { FileDown, FileScan, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBadgeUrl } from "@m/base/components/CBadgeUrl";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CSwitch } from "@m/core/components/CSwitch";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeQdmsIntegrationBindingPage } from "../components/CBadgeQdmsIntegrationBindingPage";
import { IDtoQdmsIntegrationResponse } from "../interfaces/IDtoQdmsIntegration";

export function CQdmsIntegrationList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("qdmsLong") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/dms/qdms-integration/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const handleDelete = useCallback(
    async (record: IDtoQdmsIntegrationResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE("/u/dms/qdms-integration/item/{id}", {
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

  const handleFetch = useCallback(
    async (record: IDtoQdmsIntegrationResponse) => {
      const res = await Api.POST("/u/dms/qdms-integration/item/{id}/fetch", {
        params: { path: { id: record.id } },
      });
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  const createSwitchHandler = useCallback(
    (recordId: string) => async (value: boolean) => {
      const res = await Api.PUT(
        "/u/dms/qdms-integration/item/{id}/set-enabled",
        {
          params: { path: { id: recordId } },
          body: { value },
        },
      );
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  const actions = useCallback<
    IDropdownListCallback<IDtoQdmsIntegrationResponse>
  >(
    (d) => [
      {
        icon: FileScan,
        label: t("seeFile"),
        path: `/dms/qdms-integration/item/${d.id}/file`,
        disabled: !d.lastFetchedAt,
      },
      {
        icon: FileDown,
        label: t("fetch"),
        onClick: handleFetch,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/dms/qdms-integration/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, handleFetch, t],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("bindingPage") + " / " + t("endpointUrl"), hideMd: true },
      { label: t("lastFetchedAt"), hideMd: true },
      { label: t("enabled"), hideSm: true, noClampLine: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/dms/qdms-integration/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <CTable noOverflow header={header}>
            {payload.records.map((d) => [
              d.name,
              <div
                key="integration"
                className="flex flex-col items-start space-y-1 max-w-64"
              >
                <CBadgeQdmsIntegrationBindingPage value={d.bindingPage} />
                <CBadgeUrl value={d.endpointUrl} />
              </div>,
              d.lastFetchedAt ? (
                <CDisplayDateAgo key="lastFetchedAt" value={d.lastFetchedAt} />
              ) : (
                <span>-</span>
              ),

              <CSwitch
                key="enabled"
                selected={d.isEnabled}
                onChange={createSwitchHandler(d.id)}
                disabled={!d.lastFetchedAt}
              />,

              <div key="actions" className="flex overflow-visible justify-end">
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
    </CBody>
  );
}
