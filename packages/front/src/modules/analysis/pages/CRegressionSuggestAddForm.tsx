import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionSuggestForm } from "../components/CRegressionSuggestForm";
import { IDtoAdvancedRegressionSuggestFormData } from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionSuggestAddForm() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoAdvancedRegressionSuggestFormData) => {
      const res = await Api.POST("/u/analysis/advanced-regression/suggest", {
        params: { query: data.query },
        body: data.body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/analysis/advanced-regression/suggestions");
      }
    },
    [apiToast, navigate],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("regressionAnalysis"),
        path: "/analysis/advanced-regression",
      },
      {
        label: t("suggestions"),
        path: "/analysis/advanced-regression/suggestions",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CRegressionSuggestForm onSubmit={handleSubmit} />
    </CBody>
  );
}
