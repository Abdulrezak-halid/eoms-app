import { z } from "@hono/zod-openapi";

import { SchemaReport } from "../schemas/SchemaReport";

export type IReport = z.infer<typeof SchemaReport>;
