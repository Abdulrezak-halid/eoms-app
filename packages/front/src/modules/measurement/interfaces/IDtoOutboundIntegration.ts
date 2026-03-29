/**
 * @file: IDtoOutboundIntegration.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoOutboundIntegrationListItem = InferApiResponse<
  "/u/measurement/outbound-integration/item",
  "get"
>["records"][number];

export type IDtoOutboundIntegrationRequest = InferApiRequest<
  "/u/measurement/outbound-integration/item",
  "post"
>;

export type IDtoOutboundIntegrationOutputRequest = InferApiRequest<
  "/u/measurement/outbound-integration/item",
  "post"
>["outputs"];

export type IDtoOutboundIntegrationResponse = InferApiResponse<
  "/u/measurement/outbound-integration/item/{id}",
  "get"
>;

export type IDtoOutboundIntegrationConfig =
  IDtoOutboundIntegrationResponse["config"];

export type IDtoOutboundIntegrationParamMockSource =
  (IDtoOutboundIntegrationConfig & {
    type: "MOCK_SOURCE";
  })["param"];
export type IDtoOutboundIntegrationParamWeatherApi =
  (IDtoOutboundIntegrationConfig & {
    type: "WEATHER_API";
  })["param"];
export type IDtoOutboundIntegrationParamOpenWeather =
  (IDtoOutboundIntegrationConfig & {
    type: "OPEN_WEATHER";
  })["param"];
export type IDtoOutboundIntegrationParamAvevaPi =
  (IDtoOutboundIntegrationConfig & {
    type: "AVEVA_PI";
  })["param"];

export type IDtoOutboundIntegrationRunRequest = InferApiRequest<
  "/u/measurement/outbound-integration/run",
  "post"
>;

export type IDtoOutboundIntegrationRunResultItem = InferApiResponse<
  "/u/measurement/outbound-integration/run",
  "post"
>["result"][number];
