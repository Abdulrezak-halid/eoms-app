/**
 * @file: SchemaWsServerMessage.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.02.2026
 * Last Modified Date: 03.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaNotificationContent } from "./SchemaNotificationContent";

export const SchemaWsServerMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("NOTIFICATION"),
    content: SchemaNotificationContent,
  }),
]);
