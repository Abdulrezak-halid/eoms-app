import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";

export const SchemaTimedValue = z.object({
  value: z.number(),
  datetime: SchemaDatetime,
});

export const SchemaTimedValueList = z.array(SchemaTimedValue);
