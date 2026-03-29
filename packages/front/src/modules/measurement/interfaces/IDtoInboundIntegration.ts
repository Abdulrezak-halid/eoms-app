/**
 * @file: IDtoInboundIntegration.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
