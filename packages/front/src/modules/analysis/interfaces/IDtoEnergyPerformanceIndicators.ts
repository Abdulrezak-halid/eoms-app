import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoEnpiRequest = InferApiRequest<"/u/analysis/enpi/item", "post">;

export type IDtoEnpiResponse = InferApiResponse<
  "/u/analysis/enpi/item/{id}",
  "get"
>;
