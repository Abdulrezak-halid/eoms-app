import { IJobName } from "./IJobHandler";

export type IJobMeta = {
  name: IJobName;
  param?: unknown;
} & (
  | { type: "CRON"; rule: string; priority?: number }
  | { type: "ONE_TIME"; datetime: string }
  | { type: "IMMEDIATE" }
);

export type IJobType = IJobMeta["type"];
