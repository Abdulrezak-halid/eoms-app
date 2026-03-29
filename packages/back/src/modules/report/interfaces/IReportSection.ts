import { z } from "@hono/zod-openapi";

import { SchemaReportSection } from "../schemas/SchemaReportSection";

export type IReportSection = z.infer<typeof SchemaReportSection>;
