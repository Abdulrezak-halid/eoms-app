import { z } from "@hono/zod-openapi";

import { SchemaNotificationContent } from "../schemas/SchemaNotificationContent";

export type INotificationContent = z.infer<typeof SchemaNotificationContent>;
