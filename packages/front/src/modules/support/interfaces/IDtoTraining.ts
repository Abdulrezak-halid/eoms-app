import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoTrainingRequest = InferApiRequest<
  "/u/support/training/item",
  "post"
>;

export type IDtoTrainingResponse = InferApiResponse<
  "/u/support/training/item/{id}",
  "get"
>;
