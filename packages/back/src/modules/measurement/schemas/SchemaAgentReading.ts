/**
 * @file: SchemaAgentReading.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";

// Schema is the same as reneryo-agent-worker
export const SchemaAgentReading = z.object({
  registers: z.array(
    z.object({
      code: z.string(),
      // TODO It is possible for value to be string, but it is not supported for now
      value: z.number(),
    }),
  ),
  datetime: SchemaDatetime,
});
