import { z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaMeterSlice = z.object({
  id: SchemaUuid,
  name: SchemaString,
  rate: z.number(),
  isMain: z.boolean(),
  energyResource: SchemaEEnergyResource,
  consumption: z.number().nullable(),
  consumptionPercentage: z.number().nullable().optional(),
  meterId: SchemaUuid,
  metric: z.object({
    id: SchemaUuid,
    name: SchemaString,
  }),
  department: z.object({
    id: SchemaUuid,
    name: SchemaString,
  }),
});
