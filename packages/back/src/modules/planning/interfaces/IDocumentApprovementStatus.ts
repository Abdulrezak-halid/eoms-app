export const DataDocumentApprovementStatus = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;
export type IDocumentApprovementStatus =
  (typeof DataDocumentApprovementStatus)[number];
