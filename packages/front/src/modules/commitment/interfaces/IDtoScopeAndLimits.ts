import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoScopeAndLimitsRequest = InferApiRequest<
  "/u/commitment/scope-and-limit/item",
  "post"
>;

export type IDtoScopeAndLimitsResponse = InferApiResponse<
  "/u/commitment/scope-and-limit/item/{id}",
  "get"
>;
