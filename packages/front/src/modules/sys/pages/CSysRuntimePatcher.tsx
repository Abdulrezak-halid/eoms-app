import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader } from "@m/core/hooks/useLoader";

export function CSysRuntimePatcher() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("sysRuntimePatcher") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/runtime-patcher/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const apiToast = useApiToast();
  const handleApply = useCallback(
    async (name: string) => {
      const res = await Api.POST("/u/sys/runtime-patcher/apply", {
        body: { name: name },
      });
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  const handleDelete = useCallback(
    async (index: number) => {
      const res = await Api.DELETE("/u/sys/runtime-patcher/item", {
        body: { index },
      });
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  const handleSync = useCallback(async () => {
    if (!data.payload) {
      return;
    }
    const res = await Api.POST("/u/sys/runtime-patcher/sync");
    apiToast(res);
    if (res.error === undefined) {
      await load();
    }
  }, [apiToast, load, data.payload]);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="space-x-2 justify-end">
        <CButton
          label={t("sysSync")}
          onClick={handleSync}
          disabled={!data.payload || data.payload.patchesNew.length === 0}
        />

        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data}>
        {(payload) =>
          payload.patchesNew.length === 0 &&
          payload.patchesApplied.length === 0 ? (
            <CNoRecord className="py-8" />
          ) : (
            <div className="space-y-2">
              {payload.patchesNew.map((d) => (
                <CCard key={d}>
                  <CLine className="p-2 space-x-4">
                    <div className="pl-4 overflow-hidden text-ellipsis">
                      {d}
                    </div>
                    <div className="grow">
                      <CBadge
                        className="text-orange-700 dark:text-orange-300"
                        value={t("sysNew")}
                      />
                    </div>
                    <CButton
                      label={t("apply")}
                      value={d}
                      onClick={handleApply}
                    />
                  </CLine>
                </CCard>
              ))}

              {payload.patchesApplied.map((d) => (
                <CCard key={d.index}>
                  <CLine className="p-2 space-x-4">
                    <div className="pl-4 py-3 overflow-hidden text-ellipsis">
                      {d.name}
                    </div>
                    <CBadge
                      className={
                        d.outdated
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-emerald-700 dark:text-emerald-300"
                      }
                      value={d.outdated ? t("sysOutdated") : t("sysApplied")}
                    />
                    <CMutedText>
                      <CDisplayDateAgo value={d.appliedAt} />
                    </CMutedText>
                    <CLine className="space-x-2 grow justify-end">
                      {!d.outdated && (
                        <CButton
                          label={t("sysReApply")}
                          value={d.name}
                          onClick={handleApply}
                        />
                      )}
                      <CButton
                        label={t("_delete")}
                        value={d.index}
                        onClick={handleDelete}
                      />
                    </CLine>
                  </CLine>
                </CCard>
              ))}
            </div>
          )
        }
      </CAsyncLoader>
    </CBody>
  );
}
