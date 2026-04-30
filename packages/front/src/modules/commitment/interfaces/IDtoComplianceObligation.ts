import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoComplianceObligationRequest = InferApiRequest<
  "/u/commitment/compliance-obligation/item",
  "post"
>;

export type IDtoComplianceObligationResponse = InferApiResponse<
  "/u/commitment/compliance-obligation/item/{id}",
  "get"
>;

export type IDtoComplianceObligationeomscleRequest = InferApiRequest<
  "/u/commitment/compliance-obligation/item/{subjectId}/eomscle",
  "post"
>;

export type IDtoComplianceObligationeomscleResponse = InferApiResponse<
  "/u/commitment/compliance-obligation/item/{subjectId}/eomscle/{id}",
  "get"
>;
