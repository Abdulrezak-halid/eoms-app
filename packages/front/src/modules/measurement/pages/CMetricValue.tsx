import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMetricCardBody } from "../components/CMetricCardBody";
import { CMetricValueGraph } from "../components/CMetricValueGraph";
import { CMetricValueTable } from "../components/CMetricValueTable";

export function CMetricValue() {
  const { t } = useTranslation();
  const { id: paramId, type } = useParams();
  const metricId = paramId || "";

  const fetcherInfo = useCallback(() => {
    return Api.GET("/u/measurement/metric/item/{id}", {
      params: { path: { id: metricId } },
    });
  }, [metricId]);

  const [metricData] = useLoader(fetcherInfo);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("metrics"),
        path: "/measurements/metric",
      },
      { label: metricData.payload?.name, dynamic: true },
      { label: t("values") },
    ],
    [metricData.payload?.name, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <CAsyncLoader data={metricData}>
        {(payload) => (
          <div className="space-y-4">
            <CCard className="p-2 pl-3">
              <CMetricCardBody data={payload} includeDescription />
            </CCard>

            {type === "table" ? (
              <CMetricValueTable unitGroup={payload.unitGroup} />
            ) : (
              <CMetricValueGraph unitGroup={payload.unitGroup} />
            )}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
