import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoDesignRequest = InferApiRequest<
  "/u/planning/design/item",
  "post"
>;

export type IDtoDesignResponse = InferApiResponse<
  "/u/planning/design/item/{id}",
  "get"
>;

export type IDtoDesignIdeaRequest = InferApiRequest<
  "/u/planning/design/item/{designId}/idea",
  "post"
>;

export type IDtoDesignIdeaResponse = InferApiResponse<
  "/u/planning/design/item/{designId}/idea/{id}",
  "get"
>;
