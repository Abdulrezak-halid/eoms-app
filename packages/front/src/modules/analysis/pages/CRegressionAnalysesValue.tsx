import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionAnalysesCardBody } from "../components/CRegressionAnalysesCardBody";
import { CRegressionAnalysesValueGraph } from "../components/CRegressionAnalysesValueGraph";

export function CRegressionAnalysesValue() {
  const { t } = useTranslation();
  const { id: paramId } = useParams();
  const resultId = paramId || "";

  const fetcher = useCallback(() => {
    return Api.GET("/u/analysis/advanced-regression/result/{resultId}", {
      params: { path: { resultId } },
    });
  }, [resultId]);

  const [data] = useLoader(fetcher);

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
      { label: t("result") },
    ],
    [data.payload?.seu?.name, data.payload?.slices, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <div className="space-y-4">
            <CCard className="p-2 pl-3">
              <CRegressionAnalysesCardBody data={payload} includeDetails />
            </CCard>

            <CRegressionAnalysesValueGraph resultId={resultId} />
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
