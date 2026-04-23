/**
 * @file: SchemaEmail.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.12.2024
 * Last Modified Date: 30.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { EMAIL_REGEX } from "common";

export const SchemaEmail = z
  .string()
  .regex(EMAIL_REGEX)
  .openapi({ example: "user@example.com" });
