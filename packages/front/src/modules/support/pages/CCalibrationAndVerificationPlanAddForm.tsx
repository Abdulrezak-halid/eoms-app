import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CCalibrationAndVerificationPlanForm } from "@m/support/components/CCalibrationAndVerificationPlanForm";
import { IDtoCalibrationPlanRequest } from "@m/support/interfaces/IDtoCalibrationPlan";

export function CCalibrationAndVerificationPlanAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoCalibrationPlanRequest) => {
      const res = await Api.POST("/u/support/calibration-plan/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/calibration-verification-plan");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("calibrationAndVerificationPlans"),
        path: "/supporting-operations/calibration-verification-plan",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CCalibrationAndVerificationPlanForm onSubmit={handleSubmit} />
    </CBody>
  );
}
