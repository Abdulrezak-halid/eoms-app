/**
 * @file: SchemaTimedValueList.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.07.2025
 * Last Modified Date: 21.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";

export const SchemaTimedValue = z.object({
  value: z.number(),
  datetime: SchemaDatetime,
});

export const SchemaTimedValueList = z.array(SchemaTimedValue);
