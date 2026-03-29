export const DataMessageQueueTaskStatus = [
  "PENDING",
  "SUCCESS",
  "FAILED",
] as const;

export type IMessageQueueTaskStatus =
  (typeof DataMessageQueueTaskStatus)[number];
