export const DataAdvancedRegressionSuggestionFail = [
  "INSUFFICIENT_DATA",
  "MESSAGE_PRODUCE_FAILED",
  "INTERNAL",
] as const;

export type IAdvancedRegressionSuggestionFail =
  (typeof DataAdvancedRegressionSuggestionFail)[number];
