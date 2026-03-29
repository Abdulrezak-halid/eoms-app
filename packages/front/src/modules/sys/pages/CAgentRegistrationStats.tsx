import { Cpu, EthernetPort, HardDrive, MemoryStick } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CCard } from "@m/core/components/CCard";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CIcon } from "@m/core/components/CIcon";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CBadgeAgentStatus } from "../../agent-management/components/CBadgeAgentStatus";
import { useAgentStatus } from "../../agent-management/hooks/useAgentStatus";
import { useAgentMetrics } from "../hooks/useAgentMetrics";

export function CAgentRegistrationStats() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/agent/item/{id}/stats", {
      params: { path: { id } },
    });
  }, [id]);

  const [data, load] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(() => {
    if (data?.payload) {
      return [
        { label: t("agentRegistration"), path: "/sys/agent-registration" },
        {
          label: data.payload.name,
          dynamic: true,
        },
        { label: t("stats") },
      ];
    }
    return [
      { label: t("agentRegistration"), path: "/sys/agent-registration" },
      { label: t("stats") },
    ];
  }, [t, data]);

  const status = useAgentStatus(
    data?.payload?.statType ?? null,
    data?.payload?.datetimeStat ?? null,
  );

  const computedData = useAgentMetrics(data);

  return (
    <CBody breadcrumbs={breadcrumbs} noFixedWidth>
      <CLine className="justify-end mb-4">
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={computedData}>
        {(payload) => (
          <div className="space-y-4">
            <CCard className="p-4">
              <div className="flex flex-col items-start @sm:flex-row @sm:items-center gap-2">
                <CBadgeAgentStatus value={status} />
                <div className="grow">
                  <div className="text-xl font-bold">{payload.name}</div>
                  <div className="space-x-2">
                    <CMutedText value={t("serialNo")} />
                    <span>{payload.serialNo}</span>
                  </div>
                </div>
                {payload.datetimeStat && (
                  <div className="space-x-2">
                    <CMutedText value={t("lastContact")} />
                    <CDisplayDateAgo value={payload.datetimeStat} />
                  </div>
                )}
              </div>
            </CCard>

            {payload.stats ? (
              <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4">
                <CCard className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent-600/10">
                      <CIcon value={Cpu} className="text-accent-500" />
                    </div>
                    <CMutedText value={t("cpu").toUpperCase()} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent-500">
                      {payload.stats.cpuUsage.toFixed(1)}%
                    </div>
                    <div className="mt-1">{payload.stats.cpuModel}</div>
                    <div className="mt-1">
                      {payload.stats.cpu.length} {t("cores")}
                    </div>
                  </div>
                </CCard>

                <CCard className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-600/10">
                      <CIcon value={MemoryStick} className="text-amber-500" />
                    </div>
                    <CMutedText value={t("ram").toUpperCase()} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-500">
                      {payload.stats.memoryPercentage.toFixed(1)}%
                    </div>
                    <div className="mt-1">
                      {payload.stats.memoryUsed.toFixed(1)} GB /{" "}
                      {payload.stats.memoryTotal.toFixed(1)} GB
                    </div>
                    <div className="mt-1">
                      {t("used")} / {t("total")}
                    </div>
                  </div>
                </CCard>

                <CCard className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-pink-600/10">
                      <CIcon value={HardDrive} className="text-pink-500" />
                    </div>
                    <CMutedText value={t("disk").toUpperCase()} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-500">
                      {payload.stats.diskUsed.toFixed(1)}GB
                    </div>
                    <div className="mt-1">
                      {payload.stats.diskPercentage.toFixed(1)}% {t("used")}
                    </div>
                    <div className="mt-1">
                      {t("total")}: {payload.stats.diskTotal.toFixed(1)} GB
                    </div>
                  </div>
                </CCard>

                <CCard className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-sky-600/10">
                      <CIcon value={EthernetPort} className="text-sky-500" />
                    </div>
                    <CMutedText value={t("network").toUpperCase()} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-sky-500">
                      {payload.stats.networkInterfaces}
                    </div>
                    <div className="mt-1">{t("interfaces")}</div>
                    <div className="mt-1">
                      <CGridBadge>
                        {payload.stats.net.map((d) => (
                          <CBadge key={d.name} value={d.name} />
                        ))}
                      </CGridBadge>
                    </div>
                  </div>
                </CCard>
              </div>
            ) : (
              <CCard className="p-8 text-center">
                <CNoRecord />
              </CCard>
            )}

            {payload.stats && (
              <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
                <CCard className="p-4">
                  <div className="font-bold mb-3">{t("systemInfo")}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <CMutedText value={t("hostname")} />
                      <span>{payload.stats.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <CMutedText value={t("platform")} />
                      <span>{payload.stats.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <CMutedText value={t("architecture")} />
                      <span>{payload.stats.arch}</span>
                    </div>
                  </div>
                </CCard>

                <CCard className="p-4">
                  <div className="font-bold mb-3">{t("diskUsage")}</div>
                  <div className="space-y-2">
                    {payload.stats.diskUsage.map((disk) => (
                      <div key={disk.mountPoint} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <CBadge value={disk.mountPoint} />
                          <span className="font-mono">
                            {disk.usePercentage}
                          </span>
                        </div>
                        <div className="mt-1">
                          {disk.used} / {disk.size} ({disk.filesystem})
                        </div>
                      </div>
                    ))}
                  </div>
                </CCard>
              </div>
            )}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
