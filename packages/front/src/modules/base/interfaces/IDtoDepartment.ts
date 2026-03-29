import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoDepartmentResponse = InferApiResponse<
  "/u/base/department/item/{id}",
  "get"
>;

export type IDtoDepartmentRequest = InferApiRequest<
  "/u/base/department/item",
  "post"
>;
