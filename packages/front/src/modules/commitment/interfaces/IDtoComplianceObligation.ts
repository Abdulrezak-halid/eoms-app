import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoComplianceObligationRequest = InferApiRequest<
  "/u/commitment/compliance-obligation/item",
  "post"
>;

export type IDtoComplianceObligationResponse = InferApiResponse<
  "/u/commitment/compliance-obligation/item/{id}",
  "get"
>;

export type IDtoComplianceObligationArticleRequest = InferApiRequest<
  "/u/commitment/compliance-obligation/item/{subjectId}/article",
  "post"
>;

export type IDtoComplianceObligationArticleResponse = InferApiResponse<
  "/u/commitment/compliance-obligation/item/{subjectId}/article/{id}",
  "get"
>;
