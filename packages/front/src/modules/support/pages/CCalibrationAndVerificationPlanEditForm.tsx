import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { CCalibrationAndVerificationPlanForm } from "@m/support/components/CCalibrationAndVerificationPlanForm";

import { IDtoCalibrationPlanRequest } from "../interfaces/IDtoCalibrationPlan";

export function CCalibrationAndVerificationPlanEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/support/calibration-plan/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoCalibrationPlanRequest) => {
      const res = await Api.PUT("/u/support/calibration-plan/item/{id}", {
        params: { path: { id } },
        body,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/supporting-operations/calibration-verification-plan");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("calibrationAndVerificationPlans"),
        path: "/supporting-operations/calibration-verification-plan",
      },
      { label: data.payload?.deviceType, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.deviceType],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CCalibrationAndVerificationPlanForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
