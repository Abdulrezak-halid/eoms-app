import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionAnalysesForm } from "../components/CRegressionAnalysesForm";
import { IDtoAdvancedRegressionCommitRequest } from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionAnalysesAddForm() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoAdvancedRegressionCommitRequest) => {
      const res = await Api.POST("/u/analysis/advanced-regression/commit", {
        body: data,
      });
      apiToast(res, { NOT_FOUND: t("insufficientDataToProcess") });

      if (!res.error) {
        navigate(`/analysis/advanced-regression/values/${res.data.id}`);
      }
    },
    [apiToast, navigate, t],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("regressionAnalysis"),
        path: "/analysis/advanced-regression",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CRegressionAnalysesForm onSubmit={handleSubmit} />
    </CBody>
  );
}
