import { z } from "@hono/zod-openapi";

export const SchemaDatetime = z.iso.datetime({ offset: true });
