import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { COperationForm } from "../components/COperationForm";

export function COperationEditForm() {
  const { t } = useTranslation();
  const { pipelineId = "", id: operationId = "" } = useParams();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const fetchPipeline = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/item/{id}", {
        params: { path: { id: pipelineId } },
      }),
    [pipelineId],
  );
  const [pipelineData] = useLoader(fetchPipeline);

  const fetchOperation = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/operation/item/{id}", {
        params: { path: { id: operationId } },
      }),
    [operationId],
  );
  const [operationData] = useLoader(fetchOperation);

  const fetchOperations = useCallback(
    () =>
      Api.GET("/u/supply-chain/pipeline/operation/item", {
        params: { query: { pipelineId } },
      }),
    [pipelineId],
  );
  const [operationsData] = useLoader(fetchOperations);

  const handleSubmit = useCallback(
    async (name: string) => {
      const current = operationData.payload;
      if (!current) {
        return;
      }

      const currentIndex =
        operationsData.payload?.records.find((r) => r.id === operationId)
          ?.index ?? 0;

      const res = await Api.PUT(
        "/u/supply-chain/pipeline/operation/item/{id}",
        {
          params: { path: { id: operationId } },
          body: {
            name,
            pipelineId: current.pipeline.id,
            index: currentIndex,
          },
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate(`/supply-chain/pipeline/item/${pipelineId}/operation`);
      }
    },
    [
      apiToast,
      navigate,
      pipelineId,
      operationId,
      operationData.payload,
      operationsData.payload?.records,
    ],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("pipelines"), path: "/supply-chain/pipeline" },
      { label: pipelineData.payload?.name, dynamic: true },
      {
        label: t("operations"),
        path: `/supply-chain/pipeline/item/${pipelineId}/operation`,
      },
      { label: operationData.payload?.name ?? "", dynamic: true },
      { label: t("edit") },
    ],
    [t, pipelineData.payload?.name, pipelineId, operationData.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={operationData}>
        {(payload) => (
          <COperationForm initialData={payload} onSubmit={handleSubmit} />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
