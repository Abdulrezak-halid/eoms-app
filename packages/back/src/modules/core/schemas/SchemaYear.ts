import { z } from "@hono/zod-openapi";
import { MAX_YEAR, MIN_YEAR } from "common";

export const SchemaYear = z.number().min(MIN_YEAR).max(MAX_YEAR);
