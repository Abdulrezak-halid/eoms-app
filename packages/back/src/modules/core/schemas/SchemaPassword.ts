/**
 * @file: SchemaPassword.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.11.2024
 * Last Modified Date: 16.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { PASSWORD_REGEX } from "common";

export const SchemaPassword = z
  .string()
  .regex(PASSWORD_REGEX)
  .openapi({ example: "SecretPassword123" });
