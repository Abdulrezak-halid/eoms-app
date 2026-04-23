import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoNonconformityRequest = InferApiRequest<
  "/u/internal-audit/nonconformity/item",
  "post"
>;

export type IDtoNonconformityResponse = InferApiResponse<
  "/u/internal-audit/nonconformity/item/{id}",
  "get"
>;
