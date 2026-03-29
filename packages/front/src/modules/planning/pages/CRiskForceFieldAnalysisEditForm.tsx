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

import { CRiskForceFieldAnalysisForm } from "../components/CRiskForceFieldAnalysisForm";
import { IDtoRiskForceFieldAnalysisRequest } from "../interfaces/IDtoRiskForceFieldAnalysis";

export function CRiskForceFieldAnalysisEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/planning/risk-force-field-analysis/item/{id}",
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
        label: t("forceFieldAnalyses"),
        path: "/planning/risks/force-field-analyses",
      },
      { label: data.payload?.parameter, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.parameter],
  );

  const handleSubmit = useCallback(
    async (body: IDtoRiskForceFieldAnalysisRequest) => {
      const res = await Api.PUT(
        "/u/planning/risk-force-field-analysis/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);
      if (!res.error) {
        navigate("/planning/risks/force-field-analyses");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CRiskForceFieldAnalysisForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
