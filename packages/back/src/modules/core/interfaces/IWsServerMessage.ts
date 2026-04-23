import { z } from "@hono/zod-openapi";

import { SchemaWsServerMessage } from "../schemas/SchemaWsServerMessage";

export type IWsServerMessage = z.infer<typeof SchemaWsServerMessage>;
