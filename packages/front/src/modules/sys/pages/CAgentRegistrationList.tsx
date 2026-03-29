import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CLine } from "@m/core/components/CLine";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CAgentRegistrationCard } from "../components/CAgentRegistrationCard";

export function CAgentRegistrationList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("agentRegistration") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/agent/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/sys/agent-registration/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CAgentRegistrationCard key={d.id} data={d} load={load} />
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
