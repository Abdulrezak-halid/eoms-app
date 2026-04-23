import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoCriticalOperationalParameterRequest = InferApiRequest<
  "/u/support/critical-operational-parameter/item",
  "post"
>;

export type IDtoCriticalOperationalParameterResponse = InferApiResponse<
  "/u/support/critical-operational-parameter/item/{id}",
  "get"
>;
