import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoRiskGapAnalysesResponse = InferApiResponse<
  "/u/planning/risk-gap-analysis/item/{id}",
  "get"
>;

export type IDtoRiskGapAnalysesRequest = InferApiRequest<
  "/u/planning/risk-gap-analysis/item",
  "post"
>;
