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

import { CRegressionAnalysesForm } from "../components/CRegressionAnalysesForm";
import { IDtoAdvancedRegressionCommitRequest } from "../interfaces/IDtoRegressionAnalyses";

export function CRegressionAnalysesCloneForm() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET(
      "/u/analysis/advanced-regression/result/{resultId}",
      {
        params: { path: { resultId: id } },
      },
    );
    return res;
  }, [id]);

  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoAdvancedRegressionCommitRequest) => {
      const res = await Api.POST("/u/analysis/advanced-regression/commit", {
        body,
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
      {
        label:
          data.payload?.seu?.name ||
          data.payload?.slices.map((slice) => slice.name).join(", ") ||
          t("meters"),
        dynamic: true,
      },
      { label: t("clone") },
    ],
    [data.payload?.seu?.name, data.payload?.slices, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CRegressionAnalysesForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
