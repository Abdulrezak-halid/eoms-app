/**
 * @file: IOutboundIntegrationType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
export const DataOutboundIntegrationType = [
  "MOCK_SOURCE",
  "WEATHER_API",
  "AVEVA_PI",
  "OPEN_WEATHER",
] as const;
export type IOutboundIntegrationType =
  (typeof DataOutboundIntegrationType)[number];
