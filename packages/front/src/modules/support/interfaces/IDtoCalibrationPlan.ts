import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoCalibrationPlanRequest = InferApiRequest<
  "/u/support/calibration-plan/item",
  "post"
>;

export type IDtoCalibrationPlanResponse = InferApiResponse<
  "/u/support/calibration-plan/item/{id}",
  "get"
>;
