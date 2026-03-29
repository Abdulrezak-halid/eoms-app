import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoRiskForceFieldAnalysisRequest = InferApiRequest<
  "/u/planning/risk-force-field-analysis/item",
  "post"
>;

export type IDtoRiskForceFieldAnalysisResponse = InferApiResponse<
  "/u/planning/risk-force-field-analysis/item/{id}",
  "get"
>;
