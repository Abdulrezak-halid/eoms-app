import { z } from "@hono/zod-openapi";

import { SchemaMetricResourceLabel } from "../schemas/SchemaMetricResourceLabel";

export type IMetricResourceLabel = z.infer<typeof SchemaMetricResourceLabel>;
