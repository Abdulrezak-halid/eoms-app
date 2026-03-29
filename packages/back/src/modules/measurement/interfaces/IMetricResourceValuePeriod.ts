export const DataMetricResourceValuePeriod = [
  "MINUTELY",
  "HOURLY",
  "DAILY",
  "MONTHLY",
] as const;

export type IMetricResourceValuePeriod =
  (typeof DataMetricResourceValuePeriod)[number];
