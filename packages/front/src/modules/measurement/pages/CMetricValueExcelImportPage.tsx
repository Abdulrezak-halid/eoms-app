import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";

import { CMetricValueExcelImportForm } from "../components/CMetricValueExcelImportForm";

export function CMetricValueExcelImportPage() {
  const { t } = useTranslation();
  const { id: metricId } = useParams<{ id: string }>();

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
      {
        label: metricData.payload?.name,
        dynamic: true,
      },
      {
        label: t("values"),
        path: `/measurements/metric/values/graph/${metricId}`,
      },
      {
        label: t("importExcelFile"),
      },
    ],
    [metricData.payload?.name, metricId, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={metricData}>
        {(payload) => <CMetricValueExcelImportForm record={payload} />}
      </CAsyncLoader>
    </CBody>
  );
}
