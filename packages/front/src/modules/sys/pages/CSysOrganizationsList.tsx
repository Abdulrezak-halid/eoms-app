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

import { COrganizationCard } from "../components/CSysOrganizationCard";

export function CSysOrganizationsList() {
  const { t } = useTranslation();
  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("sysOrganizations") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/sys/organization/item");
  }, []);
  const [data, load] = useLoader(fetcher);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="grow space-x-2 justify-end">
        <CLinkAdd path="/sys/organizations/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>
      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-4">
            {payload.records.map((d) => (
              <COrganizationCard key={d.id} data={d} load={load} />
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
