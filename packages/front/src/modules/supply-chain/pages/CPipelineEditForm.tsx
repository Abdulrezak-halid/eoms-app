import { useCallback, useMemo } from "react";
import { useParams } from "wouter";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CPipelineForm } from "../components/CPipelineForm";
import { IDtoPipelineRequest } from "../interfaces/IDtoPipeline";

export function CPipelineEditForm() {
  const { t } = useTranslation();
  const { id: paramId } = useParams();
  const id = paramId || "";
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const fetcher = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/item/{id}", {
        params: { path: { id } },
      }),
    [id],
  );
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoPipelineRequest) => {
      const res = await Api.PUT("/u/supply-chain/pipeline/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/supply-chain/pipeline");
      }
    },
    [apiToast, navigate, id],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("pipelines"), path: "/supply-chain/pipeline" },
      { label: data.payload?.name, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CPipelineForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
