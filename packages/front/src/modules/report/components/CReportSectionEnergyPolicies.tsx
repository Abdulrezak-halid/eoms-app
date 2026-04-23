import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CFormTitle } from "@m/core/components/CFormTitle";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CReportSectionEnergyPolicies() {
  const loader = useCallback(async () => {
    return await Api.GET("/u/commitment/energy-policy/item");
  }, []);

  const [data] = useLoader(loader);

  const { t } = useTranslation();

  return (
    <CAsyncLoader data={data} arrayField="records">
      {(payload) => (
        <div className="space-y-3">
          <CFormTitle value={t("energyPolicies")} />

          {payload.records.map((policy) => (
            <div key={policy.id} className="flex items-start space-x-4">
              <div className="mt-1 w-4 h-4 rounded-full border-4 border-accent-500 dark:border-accent-500 flex-none" />
              <div className="leading-relaxed whitespace-pre-wrap">
                {policy.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </CAsyncLoader>
  );
}
