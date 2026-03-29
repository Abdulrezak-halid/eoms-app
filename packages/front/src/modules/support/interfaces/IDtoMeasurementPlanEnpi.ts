import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoMeasurementPlanEnpiRequest = InferApiRequest<
  "/u/support/enpi-measurement-plan/item",
  "post"
>;
export type IDtoMeasurementPlanEnpiResponse = InferApiResponse<
  "/u/support/enpi-measurement-plan/item/{id}",
  "get"
>;
