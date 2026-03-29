import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoRiskSwotAnalysisRequest = InferApiRequest<
  "/u/planning/risk-swot-analysis/item",
  "post"
>;

export type IDtoRiskSwotAnalysisResponse = InferApiResponse<
  "/u/planning/risk-swot-analysis/item/{id}",
  "get"
>;
