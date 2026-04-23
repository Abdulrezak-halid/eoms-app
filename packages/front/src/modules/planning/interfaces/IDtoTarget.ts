import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoTargetRequest = InferApiRequest<
  "/u/planning/target/item",
  "post"
>;

export type IDtoTargetResponse = InferApiResponse<
  "/u/planning/target/item/{id}",
  "get"
>;
