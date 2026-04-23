import { z } from "@hono/zod-openapi";

import { jobNames } from "@/jobs";

import { IContextJob } from "./IContext";
import { MaybePromise } from "./MaybePromise";

export type IJobHandlerCallback<T = unknown> = (
  c: IContextJob,
  param: T,
) => MaybePromise<void>;

export type IJobHandler<T = void> = T extends void
  ? {
      cb: IJobHandlerCallback<T>;
    }
  : {
      schema: z.ZodType<T>;
      cb: IJobHandlerCallback<T>;
    };

export type IJobName = (typeof jobNames)[number];
