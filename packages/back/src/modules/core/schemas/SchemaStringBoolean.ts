/**
 * @file: SchemaStringBoolean.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 29.11.2025
 * Last Modified Date: 29.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

export const SchemaStringBoolean = z
  .enum(["true", "false"])
  .transform((val) => val === "true");
