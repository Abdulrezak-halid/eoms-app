import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CMeasurementPlanCopForm } from "../components/CMeasurementPlanCopForm";
import { IDtoMeasurementPlanCopRequest } from "../interfaces/IDtoMeasurementPlanCop";

export function CMeasurementPlanCopAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoMeasurementPlanCopRequest) => {
      const res = await Api.POST("/u/support/cop-measurement-plan/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/measurement-plan-cop");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("measurementPlansCop"),
        path: "/supporting-operations/measurement-plan-cop",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CMeasurementPlanCopForm onSubmit={handleSubmit} />
    </CBody>
  );
}
