import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoPersonalTokenResponse = InferApiResponse<
  "/u/base/user-token/item/{id}",
  "get"
>;

export type IDtoPersonalTokenRequest = InferApiRequest<
  "/u/base/user-token/item",
  "post"
>;
