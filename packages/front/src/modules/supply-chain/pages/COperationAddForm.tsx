import { useCallback, useMemo } from "react";
import { useParams } from "wouter";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { COperationForm } from "../components/COperationForm";

export function COperationAddForm() {
  const { t } = useTranslation();
  const { pipelineId = "" } = useParams();
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
      const currentCount = operationsData.payload?.records.length ?? 0;
      const res = await Api.POST("/u/supply-chain/pipeline/operation/item", {
        body: { name, pipelineId, index: currentCount },
      });
      apiToast(res);
      if (!res.error) {
        navigate(
          `/supply-chain/pipeline/item/${pipelineId}/operation`,
        );
      }
    },
    [apiToast, navigate, pipelineId, operationsData.payload?.records.length],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("pipelines"), path: "/supply-chain/pipeline" },
      { label: pipelineData.payload?.name, dynamic: true },
      {
        label: t("operations"),
        path: `/supply-chain/pipeline/item/${pipelineId}/operation`,
      },
      { label: t("add") },
    ],
    [t, pipelineData.payload?.name, pipelineId],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <COperationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
