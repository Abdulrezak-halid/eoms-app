import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoProductRequest = InferApiRequest<
  "/u/product-base/product/item",
  "post"
>;

export type IDtoProductResponse = InferApiResponse<
  "/u/product-base/product/item/{id}",
  "get"
>;
