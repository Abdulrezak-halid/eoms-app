/**
 * @file: IMetricResourceLabel.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.12.2025
 * Last Modified Date: 25.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaMetricResourceLabel } from "../schemas/SchemaMetricResourceLabel";

export type IMetricResourceLabel = z.infer<typeof SchemaMetricResourceLabel>;
