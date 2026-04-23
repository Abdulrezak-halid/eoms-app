import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CRiskSwotAnalysisForm } from "../components/CRiskSwotAnalysisForm";
import { IDtoRiskSwotAnalysisRequest } from "../interfaces/IDtoRiskSwotAnalysis";

export function CRiskSwotAnalysisAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("swotAnalyses"),
        path: "/planning/risks/swot-analyses",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoRiskSwotAnalysisRequest) => {
      const res = await Api.POST("/u/planning/risk-swot-analysis/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/risks/swot-analyses");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CRiskSwotAnalysisForm onSubmit={handleSubmit} />
    </CBody>
  );
}
