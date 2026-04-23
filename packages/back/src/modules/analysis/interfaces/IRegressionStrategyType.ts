export const DataRegressionStrategyType = ["EXPANDING_WINDOW"] as const;

export type IRegressionStrategyConfig =
  (typeof DataRegressionStrategyType)[number];
