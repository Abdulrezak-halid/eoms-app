import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoActionPlanRequest = InferApiRequest<
  "/u/planning/action-plan/item",
  "post"
>;

export type IDtoActionPlanResponse = InferApiResponse<
  "/u/planning/action-plan/item/{id}",
  "get"
>;
