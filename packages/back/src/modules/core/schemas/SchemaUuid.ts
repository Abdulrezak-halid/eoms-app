/**
 * @file: SchemaUuid.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.02.2025
 * Last Modified Date: 18.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

export const SchemaUuid = z.uuid();
