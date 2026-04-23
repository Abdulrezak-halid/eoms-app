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
