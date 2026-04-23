/**
 * @file: IWsServerMessage.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.02.2026
 * Last Modified Date: 03.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaWsServerMessage } from "../schemas/SchemaWsServerMessage";

export type IWsServerMessage = z.infer<typeof SchemaWsServerMessage>;
