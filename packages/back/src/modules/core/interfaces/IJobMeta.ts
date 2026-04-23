/**
 * @file: JobTypes.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 23.02.2025
 * Last Modified Date: 23.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
