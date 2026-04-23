import { z } from "@hono/zod-openapi";

import { SchemaNotificationContent } from "./SchemaNotificationContent";

export const SchemaWsServerMessage = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("NOTIFICATION"),
    content: SchemaNotificationContent,
  }),
]);
