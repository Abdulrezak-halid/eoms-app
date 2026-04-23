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

import { CScopeAndLimitsForm } from "../components/CScopeAndLimitsForm";
import { IDtoScopeAndLimitsRequest } from "../interfaces/IDtoScopeAndLimits";

export function CScopeAndLimitsEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/commitment/scope-and-limit/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("scopeAndLimits"),
        path: "/commitment/scope-and-limit",
      },
      { label: data.payload?.physicalLimits, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.physicalLimits],
  );

  const handleSubmit = useCallback(
    async (body: IDtoScopeAndLimitsRequest) => {
      const res = await Api.PUT("/u/commitment/scope-and-limit/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/commitment/scope-and-limit");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CScopeAndLimitsForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
