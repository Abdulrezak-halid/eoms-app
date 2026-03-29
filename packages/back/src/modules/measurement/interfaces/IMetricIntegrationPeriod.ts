/**
 * @file: IMetricIntegrationPeriod.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.08.2025
 * Last Modified Date: 31.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
export const DataMetricIntegrationPeriod = [
  "MINUTELY",
  "MINUTELY_5",
  "MINUTELY_15",
  "HOURLY",
  "DAILY",
  "MONTHLY",
] as const;

export type IMetricIntegrationPeriod =
  (typeof DataMetricIntegrationPeriod)[number];
