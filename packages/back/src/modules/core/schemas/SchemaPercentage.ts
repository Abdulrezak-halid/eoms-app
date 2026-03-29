import { z } from "@hono/zod-openapi";

export const SchemaPercentage = z.number().min(0).max(100);
