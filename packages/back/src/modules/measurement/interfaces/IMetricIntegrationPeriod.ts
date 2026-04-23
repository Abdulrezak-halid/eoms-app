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
