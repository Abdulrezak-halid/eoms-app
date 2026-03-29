import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoMeasurementPlanCopRequest = InferApiRequest<
  "/u/support/cop-measurement-plan/item",
  "post"
>;

export type IDtoMeasurementPlanCopResponse = InferApiResponse<
  "/u/support/cop-measurement-plan/item/{id}",
  "get"
>;
