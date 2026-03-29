import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CMetricForm } from "../components/CMetricForm";
import { IDtoMetricRequest } from "../interfaces/IDtoMetric";

export function CMetricAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoMetricRequest) => {
      const res = await Api.POST("/u/measurement/metric/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/measurements/metric");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("metrics"),
        path: "/measurements/metric",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CMetricForm onSubmit={handleSubmit} />
    </CBody>
  );
}
