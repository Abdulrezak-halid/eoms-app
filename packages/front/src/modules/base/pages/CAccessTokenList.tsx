import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CGridBadge } from "@m/core/components/CGridBadge";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMutedText } from "@m/core/components/CMutedText";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CBadgeMetric } from "@m/measurement/components/CBadgeMetric";

import { CTokenViewer } from "../components/CTokenViewer";
import { IDtoAccessTokenResponse } from "../interfaces/IDtoAccessToken";

export function CAccessTokenList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("accessTokens") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/base/access-token/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoAccessTokenResponse) => {
      await push(t("msgRecordDeletionConfirm"), async () => {
        const res = await Api.DELETE("/u/base/access-token/item/{id}", {
          params: { path: { id: record.id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          await load();
        }
      });
    },
    [apiToast, load, push, t],
  );

  const getListPermissions = useCallback(
    (permissions: IDtoAccessTokenResponse["permissions"]) => {
      const permissionsList: string[] = [];

      if (permissions.canListMetrics) {
        permissionsList.push(t("metrics"));
      }
      if (permissions.canListMeters) {
        permissionsList.push(t("meters"));
      }
      if (permissions.canListSeus) {
        permissionsList.push(t("seus"));
      }

      return permissionsList;
    },
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/configuration/access-token/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-4 space-y-2">
                <CLine className="@md:hidden justify-between items-start space-x-2">
                  <div className="font-bold pt-3 truncate">{d.name}</div>
                  <div className="flex space-x-2">
                    <CLink
                      icon={Pencil}
                      label={t("edit")}
                      path={`/configuration/access-token/item/${d.id}`}
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

                <div className="flex flex-col @md:flex-row @md:items-center gap-2">
                  <CMutedText className="hidden @md:block @md:w-1/3 shrink-0 truncate">
                    {d.name}
                  </CMutedText>

                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <CTokenViewer value={d.token} />

                    <div className="hidden @md:flex items-center gap-2 shrink-0">
                      <CLink
                        icon={Pencil}
                        label={t("edit")}
                        path={`/configuration/access-token/item/${d.id}`}
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
                  </div>
                </div>

                {d.permissions.metricResourceValueMetrics &&
                  d.permissions.metricResourceValueMetrics.length > 0 && (
                    <div className="flex flex-col">
                      <CMutedText className="shrink-0">
                        {t("metricValues")}
                      </CMutedText>
                      <CGridBadge className="truncate">
                        {d.permissions.metricResourceValueMetrics.map(
                          (metric) => (
                            <CBadgeMetric key={metric.id} value={metric.name} />
                          ),
                        )}
                      </CGridBadge>
                    </div>
                  )}

                {getListPermissions(d.permissions).length > 0 && (
                  <CLine className="space-x-2">
                    <CMutedText className="shrink-0">{t("canList")}</CMutedText>
                    <CGridBadge>
                      {getListPermissions(d.permissions).map((permission) => (
                        <CBadge key={permission} value={permission} />
                      ))}
                    </CGridBadge>
                  </CLine>
                )}
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
