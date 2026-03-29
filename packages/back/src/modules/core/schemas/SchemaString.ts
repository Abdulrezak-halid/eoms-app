import { z } from "@hono/zod-openapi";
import { MAX_API_STRING_LENGTH } from "common";

export const SchemaString = z.string().min(1).max(MAX_API_STRING_LENGTH);

export const SchemaStringEmptyAllowed = z.string().max(MAX_API_STRING_LENGTH);
