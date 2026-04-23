export const DataPeriod = [
  "MONTHLY",
  "QUARTERLY",
  "WEEKLY",
  "YEARLY",
] as const;

export type IPeriod = (typeof DataPeriod)[number];