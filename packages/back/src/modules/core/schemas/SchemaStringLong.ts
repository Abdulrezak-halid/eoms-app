/**
 * @file: SchemaString.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.11.2024
 * Last Modified Date: 16.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { MAX_API_STRING_LONG_LENGTH } from "common";

export const SchemaStringLong = z
  .string()
  .min(1)
  .max(MAX_API_STRING_LONG_LENGTH);
