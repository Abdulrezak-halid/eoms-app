import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoMetricRequest = InferApiRequest<
  "/u/measurement/metric/item",
  "post"
>;

export type IDtoMetricResponse = InferApiResponse<
  "/u/measurement/metric/item/{id}",
  "get"
>;
