import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CRiskForceFieldAnalysisForm } from "../components/CRiskForceFieldAnalysisForm";
import { IDtoRiskForceFieldAnalysisRequest } from "../interfaces/IDtoRiskForceFieldAnalysis";

export function CRiskForceFieldAnalysisAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("forceFieldAnalyses"),
        path: "/planning/risks/force-field-analyses",
      },
      {
        label: t("add"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (data: IDtoRiskForceFieldAnalysisRequest) => {
      const res = await Api.POST("/u/planning/risk-force-field-analysis/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/risks/force-field-analyses");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CRiskForceFieldAnalysisForm onSubmit={handleSubmit} />
    </CBody>
  );
}
