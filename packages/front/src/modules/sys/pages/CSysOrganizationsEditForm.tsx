import { useCallback, useContext, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CSysOrganizationsForm } from "../components/CSysOrganizationsForm";
import { IDtoSysOrganizationsRequest } from "../interfaces/IDtoSysOrganizations";

export function CSysOrganizationsEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/sys/organization/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("sysOrganizations"),
        path: "/sys/organizations",
      },
      { label: data.payload?.displayName, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.displayName],
  );

  const handleSubmit = useCallback(
    async (body: IDtoSysOrganizationsRequest) => {
      await push(
        t("allUserSessionsWillBeDroppedOnUpdateOrganization"),
        async () => {
          const res = await Api.PUT("/u/sys/organization/item/{id}", {
            params: { path: { id } },
            body,
          });
          apiToast(res);
          if (!res.error) {
            navigate("/sys/organizations");
          }
        },
      );
    },
    [apiToast, navigate, id, push, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CSysOrganizationsForm
            initialData={payload}
            onSubmit={handleSubmit}
            showAdminFields={false}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
