import { z } from "@hono/zod-openapi";

import { SchemaString } from "./SchemaString";
import { SchemaUuid } from "./SchemaUuid";

const SchemaEOutboundIntegrationType = z.string();
const SchemaPlainOrTranslatableText = z.string();

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
