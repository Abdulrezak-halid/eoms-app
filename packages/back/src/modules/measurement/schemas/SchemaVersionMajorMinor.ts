import { z } from "@hono/zod-openapi";

export const SchemaVersionMajorMinor = z.string().regex(/^\d+\.\d+$/);
