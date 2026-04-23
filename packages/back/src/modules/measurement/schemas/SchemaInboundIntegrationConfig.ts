import { z } from "@hono/zod-openapi";

import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaInboundIntegrationConfig = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("WEBHOOK"),
  }),
  z.object({
    type: z.literal("AGENT"),
    agentId: SchemaUuid,
  }),
]);

export const SchemaInboundIntegrationConfigGetter = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("WEBHOOK"),
    }),
    z.object({
      type: z.literal("AGENT"),
      agent: z.object({ id: SchemaUuid, name: SchemaString }),
    }),
  ],
);
