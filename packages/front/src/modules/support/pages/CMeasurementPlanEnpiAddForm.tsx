import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CMeasurementPlanEnpiForm } from "../components/CMeasurementPlanEnpiForm";
import { IDtoMeasurementPlanEnpiRequest } from "../interfaces/IDtoMeasurementPlanEnpi";

export function CMeasurementPlanEnpiAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoMeasurementPlanEnpiRequest) => {
      const res = await Api.POST("/u/support/enpi-measurement-plan/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/measurement-plan-enpi");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("measurementPlansEnpi"),
        path: "/supporting-operations/measurement-plan-enpi",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CMeasurementPlanEnpiForm onSubmit={handleSubmit} />
    </CBody>
  );
}
