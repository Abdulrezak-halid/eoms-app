import { z } from "@hono/zod-openapi";
import { PASSWORD_REGEX } from "common";

export const SchemaPassword = z
  .string()
  .regex(PASSWORD_REGEX)
  .openapi({ example: "SecretPassword123" });
