import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CCriticalOperationalParameterForm } from "../components/CCriticalOperationalParameterForm";
import { IDtoCriticalOperationalParameterRequest } from "../interfaces/IDtoCriticalOperationalParameter";

export function CCriticalOperationalParameterEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/support/critical-operational-parameter/item/{id}",
      {
        params: { path: { id } },
      },
    );
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("criticalOperationalParameters"),
        path: "/supporting-operations/critical-operational-parameter",
      },
      { label: data.payload?.parameter, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.parameter],
  );

  const handleSubmit = useCallback(
    async (body: IDtoCriticalOperationalParameterRequest) => {
      const res = await Api.PUT(
        "/u/support/critical-operational-parameter/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate("/supporting-operations/critical-operational-parameter");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CCriticalOperationalParameterForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
