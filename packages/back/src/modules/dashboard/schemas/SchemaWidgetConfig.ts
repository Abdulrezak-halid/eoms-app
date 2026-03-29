import { z } from "@hono/zod-openapi";

export const SchemaWidgetConfig = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("GRAPH_SEU_VALUE"),
    seuIds: z.array(z.string()),
  }),
  z.object({
    type: z.literal("GRAPH_DATA_VIEW_VALUE"),
    dataViewId: z.string(),
  }),
  z.object({
    type: z.literal("GRAPH_ADVANCED_REGRESSION_RESULT"),
    regressionResultId: z.string().nullable(),
  }),
  z.object({
    type: z.literal("GRAPH_METRIC"),
    metricId: z.string(),
  }),
  z.object({
    type: z.literal("ENERGY_POLICY"),
  }),
  z.object({
    type: z.literal("ENERGY_RESOURCE_PIE_CHART"),
  }),
  z.object({
    type: z.literal("SEU_PIE_CHART"),
    seuIds: z.array(z.string()),
  }),
]);
