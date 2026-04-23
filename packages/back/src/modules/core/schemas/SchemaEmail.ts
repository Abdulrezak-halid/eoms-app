import { z } from "@hono/zod-openapi";
import { EMAIL_REGEX } from "common";

export const SchemaEmail = z
  .string()
  .regex(EMAIL_REGEX)
  .openapi({ example: "user@example.com" });
