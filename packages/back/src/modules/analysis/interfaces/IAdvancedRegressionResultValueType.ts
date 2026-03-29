export const DataAdvancedRegressionResultValueType = [
  "EXPECTED",
  "OBSERVED",
  "DIFFERENCE",
  "CUMULATIVE_DIFFERENCE",
  "SOURCE_METER_SLICE",
  "SOURCE_DRIVER",
] as const;

export type IAdvancedRegressionResultValueType =
  (typeof DataAdvancedRegressionResultValueType)[number];
