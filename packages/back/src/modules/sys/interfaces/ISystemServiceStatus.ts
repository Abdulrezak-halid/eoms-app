
export const DataSystemServiceStatus = [
  "NOT_INITED",
  "CONNECTING",
  "CONNECTED",
  "CLOSED",
] as const;
export type ISystemServiceStatus = (typeof DataSystemServiceStatus)[number];
