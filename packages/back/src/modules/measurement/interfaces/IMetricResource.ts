import { z } from "@hono/zod-openapi";

import { SchemaMetricResource } from "../schemas/SchemaMetricResource";

export type IMetricResource = z.infer<typeof SchemaMetricResource>;
