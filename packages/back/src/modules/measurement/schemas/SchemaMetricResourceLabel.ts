/**
 * @file: SchemaMetricResourceLabel.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 26.12.2025
 * Last Modified Date: 26.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaString } from "@m/core/schemas/SchemaString";

import { SchemaEInboundIntegrationType } from "./SchemaEInboundIntegrationType";
import { SchemaEOutboundIntegrationType } from "./SchemaEOutboundIntegrationType";

export const SchemaMetricResourceLabelWithoutType = z
  .object({
    key: SchemaString,
    value: SchemaString,
  })
  .openapi("IDtoMetricResourceLabelWithoutType");

export const SchemaMetricResourceLabelUserDefined = z
  .object({
    type: z.literal("USER_DEFINED"),
    key: SchemaString,
    value: SchemaString,
  })
  .openapi("IDtoMetricResourceLabelUserDefined");

export const SchemaMetricResourceLabel = z
  .discriminatedUnion("type", [
    // Generic user defined labels
    SchemaMetricResourceLabelUserDefined,

    // Internal strictly typed labels
    z.object({
      type: z.literal("INTERNAL"),
      key: z.literal("SOURCE"),
      value: z.enum([
        "DEV_SEED",
        "EXCEL",
        "OUTBOUND_INTEGRATION",
        "INBOUND_INTEGRATION",
        "API",
      ]),
    }),
    z.object({
      type: z.literal("INTERNAL"),
      key: z.literal("OUTBOUND_INTEGRATION_TYPE"),
      value: SchemaEOutboundIntegrationType,
    }),
    z.object({
      type: z.literal("INTERNAL"),
      key: z.literal("INBOUND_INTEGRATION_TYPE"),
      value: SchemaEInboundIntegrationType,
    }),
  ])
  .openapi("IDtoMetricResourceLabel");
