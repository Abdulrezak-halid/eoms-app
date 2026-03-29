import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoPlanRequest = InferApiRequest<
  "/u/internal-audit/plan/item",
  "post"
>;

export type IDtoPlanResponse = InferApiResponse<
  "/u/internal-audit/plan/item/{id}",
  "get"
>;
