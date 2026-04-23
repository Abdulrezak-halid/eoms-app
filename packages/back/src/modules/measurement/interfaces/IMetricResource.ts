/**
 * @file: IMetricResource.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaMetricResource } from "../schemas/SchemaMetricResource";

export type IMetricResource = z.infer<typeof SchemaMetricResource>;
