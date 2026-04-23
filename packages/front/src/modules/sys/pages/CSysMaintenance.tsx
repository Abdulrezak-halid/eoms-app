import { useCallback } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CCardTitle } from "@m/base/components/CCardTitle";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { useLoader } from "@m/core/hooks/useLoader";

export function CSysMaintenance() {
  const { t } = useTranslation();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/maintenance");
  }, []);
  const [data, load] = useLoader(fetcher);

  const apiToast = useApiToast();
  const handleSet = useCallback(
    async (value: boolean) => {
      const res = await Api.POST("/u/sys/maintenance", { body: { value } });
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    },
    [apiToast, load],
  );

  return (
    <CBody title={t("sysMaintenance")}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <div className="space-y-4">
            <CLine className="justify-end">
              <CButtonRefresh onClick={load} />
            </CLine>

            <CCard>
              <CLine className="p-2 space-x-4">
                <CCardTitle value={t("sysMaintenance")} className="grow pl-3" />
                {payload.value ? (
                  <>
                    <CBadge
                      className="text-orange-600 dark:text-orange-300"
                      value={t("enabled")}
                    />
                    <CButton
                      label={t("disable")}
                      value={false}
                      onClick={handleSet}
                    />
                  </>
                ) : (
                  <>
                    <CBadge value={t("disabled")} />
                    <CButton
                      label={t("enable")}
                      value={true}
                      onClick={handleSet}
                    />
                  </>
                )}
              </CLine>
            </CCard>
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
