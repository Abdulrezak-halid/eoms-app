import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoQdmsIntegrationRequest = InferApiRequest<
  "/u/dms/qdms-integration/item",
  "post"
>;

export type IDtoQdmsIntegrationResponse = InferApiResponse<
  "/u/dms/qdms-integration/item/{id}",
  "get"
>;
