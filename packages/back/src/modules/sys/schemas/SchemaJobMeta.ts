import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaEJobName } from "./SchemaEJobName";

export const SchemaJobMeta = z.discriminatedUnion("type", [
  z.object({
    name: SchemaEJobName,
    param: z.unknown().optional(),
    type: z.literal("CRON"),
    rule: SchemaString,
    priority: z.number().optional(),
  }),
  z.object({
    name: SchemaEJobName,
    param: z.unknown().optional(),
    type: z.literal("ONE_TIME"),
    datetime: SchemaDatetime,
  }),
  z.object({
    name: SchemaEJobName,
    param: z.unknown().optional(),
    type: z.literal("IMMEDIATE"),
  }),
]);
