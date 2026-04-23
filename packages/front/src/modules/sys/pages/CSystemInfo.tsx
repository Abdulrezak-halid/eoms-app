import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { classNames } from "@m/core/utils/classNames";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CSystemInfo() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("systemInfo") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/system-info");
  }, []);
  const [data, load] = useLoader(fetcher);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="space-x-2 justify-end">
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data}>
        {(payload) => (
          <div className="space-y-2">
            <CCard>
              <CLine className="p-3 pl-4 space-x-4">
                <div className="overflow-hidden text-ellipsis">
                  Message Queue
                </div>

                <CBadge
                  className={classNames(
                    payload.services.messageQueue === "NOT_INITED"
                      ? ""
                      : payload.services.messageQueue === "CONNECTING"
                        ? "text-orange-700 dark:text-orange-300"
                        : payload.services.messageQueue === "CONNECTED"
                          ? "text-green-700 dark:text-green-300"
                          : payload.services.messageQueue === "CLOSED"
                            ? ""
                            : "",
                  )}
                  value={payload.services.messageQueue}
                />
              </CLine>
            </CCard>
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
