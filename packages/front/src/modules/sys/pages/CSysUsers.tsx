import { useCallback, useContext, useMemo } from "react";
import { UserRoundCog } from "lucide-react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { ContextSession } from "@m/base/contexts/ContextSession";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CSysUsers() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("users") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/user/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { session, setSession } = useContext(ContextSession);

  const apiToast = useApiToast();
  const handleImpersonate = useCallback(
    async (id: string) => {
      const res = await Api.POST("/u/sys/user/impersonate", {
        body: { id },
      });
      apiToast(res);
      if (res.error === undefined) {
        setSession(res.data);
      }
    },
    [apiToast, setSession],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data}>
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-2 pl-4">
                <CLine className="space-x-4">
                  <div>{d.displayName}</div>

                  <div>{d.email}</div>

                  <CMutedText className="grow">{d.orgDisplayName}</CMutedText>

                  {d.lastSessionAt && (
                    <div className="leading-5 text-right">
                      <div>
                        <CMutedText>{t("lastSession")}</CMutedText>
                      </div>
                      <div>
                        <CDisplayDateAgo value={d.lastSessionAt} />
                      </div>
                    </div>
                  )}

                  <CButton
                    icon={UserRoundCog}
                    label={t("sysImpersonate")}
                    value={d.id}
                    onClick={handleImpersonate}
                    disabled={d.id === session.userId}
                  />
                </CLine>
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
