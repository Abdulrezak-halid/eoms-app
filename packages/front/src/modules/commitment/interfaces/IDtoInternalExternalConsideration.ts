import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoInternalExternalConsiderationRequest = InferApiRequest<
  "/u/commitment/internal-external-consideration/item",
  "post"
>;

export type IDtoInternalExternalConsiderationItemResponse = InferApiResponse<
  "/u/commitment/internal-external-consideration/item/{id}",
  "get"
>;
