/**
 * @file: SchemaVersionMajorMinor.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

export const SchemaVersionMajorMinor = z.string().regex(/^\d+\.\d+$/);
