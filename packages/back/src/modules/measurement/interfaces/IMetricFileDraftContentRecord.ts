import { z } from "@hono/zod-openapi";

import { SchemaMetricFileDraftContentRecord } from "../schemas/SchemaMetricFileDraftContentRecord";

export type IMetricFileDraftContentRecord = z.infer<
  typeof SchemaMetricFileDraftContentRecord
>;
