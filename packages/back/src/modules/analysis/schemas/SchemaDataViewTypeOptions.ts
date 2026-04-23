import { z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaDataViewTypeOptions = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("METRIC"),
    metricIds: z.array(SchemaUuid),
  }),
  z.object({
    type: z.literal("METER_SLICE"),
    energyResource: SchemaEEnergyResource,
    meterSliceIds: z.array(SchemaUuid),
  }),
  z.object({
    type: z.literal("SEU"),
    energyResource: SchemaEEnergyResource,
    seuIds: z.array(SchemaUuid),
  }),
]);

export const SchemaDataViewTypeOptionsWithDetails = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("METRIC"),
      metrics: z.array(
        z.object({
          id: SchemaUuid,
          name: SchemaString,
        }),
      ),
    }),
    z.object({
      type: z.literal("METER_SLICE"),
      meterSlices: z.array(
        z.object({
          id: SchemaUuid,
          name: SchemaString,
          energyResource: SchemaEEnergyResource,
        }),
      ),
    }),
    z.object({
      type: z.literal("SEU"),
      seus: z.array(
        z.object({
          id: SchemaUuid,
          name: SchemaString,
          energyResource: SchemaEEnergyResource,
        }),
      ),
    }),
  ],
);
