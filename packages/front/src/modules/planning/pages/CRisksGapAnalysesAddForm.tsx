import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CRisksGapAnalysesForm } from "@m/planning/components/CRisksGapAnalysesForm";

import { IDtoRiskGapAnalysesRequest } from "../interfaces/IDtoRiskGapAnalyses";

export function CRisksGapAnalysesAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoRiskGapAnalysesRequest) => {
      const res = await Api.POST("/u/planning/risk-gap-analysis/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/planning/risks/gap-analyses");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("gapAnalyses"),
        path: "/planning/risks/gap-analyses",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CRisksGapAnalysesForm onSubmit={handleSubmit} />
    </CBody>
  );
}
