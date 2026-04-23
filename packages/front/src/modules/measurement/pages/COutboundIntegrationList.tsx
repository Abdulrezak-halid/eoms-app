import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { CSwitch } from "@m/core/components/CSwitch";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMetricIntegrationTab } from "../components/CMetricIntegrationTab";
import { COutboundIntegrationOutputCardBody } from "../components/COutboundIntegrationOutputCardBody";
import { IDtoOutboundIntegrationListItem } from "../interfaces/IDtoOutboundIntegration";

export function COutboundIntegrationList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("integrations") }, { label: t("outbound") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/outbound-integration/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoOutboundIntegrationListItem) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/measurement/outbound-integration/item/{id}",
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

  const handleChangeSwitch = useCallback(
    (id: string) => async (enabled: boolean) => {
      const result = await Api.PUT(
        "/u/measurement/outbound-integration/item/{id}/enable",
        {
          params: { path: { id } },
          body: { enabled },
        },
      );
      apiToast(result);
      if (result.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-between grow">
        <CMetricIntegrationTab />

        <div className="flex space-x-2">
          <CLinkAdd path="/measurements/metric-integration/outbound/item-add" />
          <CButtonRefresh onClick={load} />
        </div>
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-4 pt-2 pr-2 space-y-2">
                <CLine className="items-start justify-between space-x-2">
                  <div className="pt-3 font-bold truncate">{d.name}</div>
                  <div className="flex space-x-2">
                    <CLink
                      icon={Pencil}
                      label={t("edit")}
                      path={`/measurements/metric-integration/outbound/item/${d.id}`}
                      hideLabelLg
                    />
                    <CButton
                      icon={Trash2}
                      label={t("_delete")}
                      value={d}
                      onClick={handleDelete}
                      hideLabelLg
                    />
                  </div>
                </CLine>

                <div className="flex flex-col @md:flex-row @md:items-start justify-between grow gap-x-4 gap-y-2">
                  <div className="@md:grow">
                    <COutboundIntegrationOutputCardBody data={d} />
                  </div>

                  <div className="flex flex-col @md:text-right">
                    <CMutedText>{t("lastRunAt")}</CMutedText>
                    <CDisplayDateAgo value={d.lastRunAt} />
                  </div>

                  <div className="@md:order-none order-first @md:text-right">
                    <CMutedText value={t("enable")} />
                    <CSwitch
                      selected={d.enabled}
                      onChange={handleChangeSwitch(d.id)}
                    />
                  </div>
                </div>
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
