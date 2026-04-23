import { z } from "@hono/zod-openapi";

import { SchemaEOutboundIntegrationType } from "@m/measurement/schemas/SchemaEOutboundIntegrationType";
import { SchemaPlainOrTranslatableText } from "@m/report/schemas/SchemaTranslatableKeys";

import { SchemaString } from "./SchemaString";
import { SchemaUuid } from "./SchemaUuid";

export const SchemaNotificationContent = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("REPORT_RENDER_COMPLETED"),
      reportId: SchemaUuid,
      reportTitle: SchemaPlainOrTranslatableText,
    }),
    z.object({
      type: z.literal("TEST"),
    }),
    z.object({
      type: z.literal("WELCOME"),
    }),
    z.object({
      type: z.literal("PARTNERSHIP_CREATED"),
      organizationName: SchemaString,
    }),
    z.object({
      type: z.literal("OUTBOUND_INTEGRATION_BROKEN"),
      integrationType: SchemaEOutboundIntegrationType,
      metricName: SchemaString,
    }),
  ])
  .openapi("IDtoNotificationContent");
