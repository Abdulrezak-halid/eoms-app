import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoProcurementProcedureRequest = InferApiRequest<
  "/u/support/procurement-procedure/item",
  "post"
>;

export type IDtoProcurementProcedureResponse = InferApiResponse<
  "/u/support/procurement-procedure/item/{id}",
  "get"
>;
