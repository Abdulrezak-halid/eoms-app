
export const DataIssueType = ["BUG_REPORT", "FEATURE_REQUEST"] as const;

export type IIssueType = (typeof DataIssueType)[number];
