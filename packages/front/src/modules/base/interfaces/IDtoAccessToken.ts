import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoAccessTokenResponse = InferApiResponse<
  "/u/base/access-token/item/{id}",
  "get"
>;

export type IDtoAccessTokenRequest = InferApiRequest<
  "/u/base/access-token/item",
  "post"
>;
