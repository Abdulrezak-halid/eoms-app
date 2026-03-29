import { z } from "@hono/zod-openapi";
import { MAX_API_STRING_LONG_LENGTH } from "common";

export const SchemaStringLong = z
  .string()
  .min(1)
  .max(MAX_API_STRING_LONG_LENGTH);
