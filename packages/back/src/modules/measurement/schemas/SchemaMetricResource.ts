/**
 * @file: SchemaMetricResource.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.12.2025
 * Last Modified Date: 27.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

import { SchemaEMetricType } from "./SchemaEMetricType";
import { SchemaEUnitGroup } from "./SchemaEUnitGroup";
import { SchemaMetricResourceLabel } from "./SchemaMetricResourceLabel";

export const SchemaMetricResource = z
  .object({
    id: SchemaUuid,
    metric: z.object({
      id: SchemaUuid,
      name: SchemaString,
      type: SchemaEMetricType,
      unitGroup: SchemaEUnitGroup,
    }),
    labels: z.array(SchemaMetricResourceLabel),
  })
  .openapi("IDtoMetricResource");
