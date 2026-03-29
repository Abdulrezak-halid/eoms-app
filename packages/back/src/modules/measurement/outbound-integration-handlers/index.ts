/**
 * @file: index.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.07.2025
 * Last Modified Date: 10.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IOutboundIntegrationHandler } from "../interfaces/IOutboundIntegrationHandler";
import { IOutboundIntegrationType } from "../interfaces/IOutboundIntegrationType";
import { OutboundIntegrationHandlerAvevaPi } from "./OutboundIntegrationHandlerAvevaPi";
import { OutboundIntegrationHandlerMockSource } from "./OutboundIntegrationHandlerMockSource";
import { OutboundIntegrationHandlerOpenWeather } from "./OutboundIntegrationHandlerOpenWeather";
import { OutboundIntegrationHandlerWeatherApi } from "./OutboundIntegrationHandlerWeatherApi";

const handlers: Record<
  IOutboundIntegrationType,
  IOutboundIntegrationHandler<unknown>
> = {
  MOCK_SOURCE: OutboundIntegrationHandlerMockSource,
  WEATHER_API: OutboundIntegrationHandlerWeatherApi,
  OPEN_WEATHER: OutboundIntegrationHandlerOpenWeather,
  AVEVA_PI: OutboundIntegrationHandlerAvevaPi,
};

export function getOutboundIntegrationHandler(type: IOutboundIntegrationType) {
  return handlers[type];
}
