export const DataMetricType = ["GAUGE", "COUNTER"] as const;
export type IMetricType = (typeof DataMetricType)[number];
