import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoInboundIntegrationListItem = InferApiResponse<
  "/u/measurement/inbound-integration/item",
  "get"
>["records"][number];

export type IDtoInboundIntegrationRequest = InferApiRequest<
  "/u/measurement/inbound-integration/item",
  "post"
>;

export type IDtoInboundIntegrationResponse = InferApiResponse<
  "/u/measurement/inbound-integration/item/{id}",
  "get"
>;
