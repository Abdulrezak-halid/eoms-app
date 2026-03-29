import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoProcurementRequest = InferApiRequest<
  "/u/support/procurement/item",
  "post"
>;

export type IDtoProcurementResponse = InferApiResponse<
  "/u/support/procurement/item/{id}",
  "get"
>;
