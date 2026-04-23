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

import { CRiskSwotAnalysisForm } from "../components/CRiskSwotAnalysisForm";
import { IDtoRiskSwotAnalysisRequest } from "../interfaces/IDtoRiskSwotAnalysis";

export function CRiskSwotAnalysisEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/planning/risk-swot-analysis/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("swotAnalyses"),
        path: "/planning/risks/swot-analyses",
      },
      { label: data.payload?.type, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.type],
  );

  const handleSubmit = useCallback(
    async (body: IDtoRiskSwotAnalysisRequest) => {
      const res = await Api.PUT("/u/planning/risk-swot-analysis/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);
      if (!res.error) {
        navigate("/planning/risks/swot-analyses");
      }
    },
    [apiToast, navigate, id],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CRiskSwotAnalysisForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
