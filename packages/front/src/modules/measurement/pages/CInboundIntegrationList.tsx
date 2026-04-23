import { FileCode2, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo, useState } from "react";

import { CBadgeAgent } from "@m/agent-management/components/CBadgeAgent";
import { Api } from "@m/base/api/Api";
import { CBadgeNotConfigured } from "@m/base/components/CBadgeNotConfigured";
import { CBadgeUnit } from "@m/base/components/CBadgeUnit";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { CShowMore } from "@m/base/components/CShowMore";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { CSwitch } from "@m/core/components/CSwitch";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeInboundIntegrationType } from "../components/CBadgeInboundIntegrationType";
import { CBadgeMetric } from "../components/CBadgeMetric";
import { CMetricIntegrationTab } from "../components/CMetricIntegrationTab";
import { CWebhookSourceCodeModal } from "../components/CWebhookSourceCodeModal";
import { IDtoInboundIntegrationListItem } from "../interfaces/IDtoInboundIntegration";

export function CInboundIntegrationList() {
  const { t } = useTranslation();
  const [selectedRecordForApiCode, setSelectedRecordForApiCode] =
    useState<IDtoInboundIntegrationListItem | null>(null);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("integrations") }, { label: t("inbound") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/inbound-integration/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoInboundIntegrationListItem) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/measurement/inbound-integration/item/{id}",
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
        "/u/measurement/inbound-integration/item/{id}/enable",
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

  const handleShowCode = useCallback(
    (record: IDtoInboundIntegrationListItem) => {
      setSelectedRecordForApiCode(record);
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedRecordForApiCode(null);
  }, []);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-between grow">
        <CMetricIntegrationTab />

        <div className="flex space-x-2">
          <CLinkAdd path="/measurements/metric-integration/inbound/item-add" />
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
                    {d.config.type === "WEBHOOK" && (
                      <CButton
                        icon={FileCode2}
                        label={t("apiExample")}
                        value={d}
                        onClick={handleShowCode}
                        hideLabelLg
                      />
                    )}

                    <CLink
                      icon={Pencil}
                      label={t("edit")}
                      path={`/measurements/metric-integration/inbound/item/${d.id}`}
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
                  <div className="space-y-2 @md:grow order-last @md:order-none">
                    <div className="flex flex-col space-y-2 @sm:flex-row @sm:space-y-0 @sm:space-x-2">
                      <div className="@sm:w-1/2 space-y-2">
                        <div className="space-x-2">
                          <CBadgeInboundIntegrationType value={d.config.type} />
                          <div className="mt-2">
                            {d.config.type === "AGENT" && (
                              <CBadgeAgent value={d.config.agent.name} />
                            )}
                          </div>
                        </div>

                        {d.config.type === "WEBHOOK" && (
                          <div>
                            <CBadge value={`ID: ${d.id}`} wrap />
                          </div>
                        )}

                        <div className="space-y-2">
                          <CMutedText value={t("outputs")} />
                          {d.outputs.length === 0 ? (
                            <div>
                              <CBadgeNotConfigured />
                            </div>
                          ) : (
                            <CShowMore>
                              <div className="space-y-2">
                                {d.outputs.map((output) => (
                                  <div
                                    className="flex space-x-2"
                                    key={output.outputKey}
                                  >
                                    {d.config.type === "AGENT" && (
                                      <CBadge value={output.outputKey} />
                                    )}
                                    <CBadgeMetric value={output.metricName} />
                                    <CBadgeUnit value={output.unit} />
                                  </div>
                                ))}
                              </div>
                            </CShowMore>
                          )}
                        </div>
                      </div>
                    </div>
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
      {selectedRecordForApiCode && (
        <CWebhookSourceCodeModal
          onClose={handleCloseModal}
          record={selectedRecordForApiCode}
        />
      )}
    </CBody>
  );
}
