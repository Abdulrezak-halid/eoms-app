export const DataOutboundIntegrationType = [
  "MOCK_SOURCE",
  "WEATHER_API",
  "AVEVA_PI",
  "OPEN_WEATHER",
] as const;
export type IOutboundIntegrationType =
  (typeof DataOutboundIntegrationType)[number];
