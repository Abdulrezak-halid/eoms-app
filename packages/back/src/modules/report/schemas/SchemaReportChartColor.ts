import { z } from "@hono/zod-openapi";

export const SchemaReportChartColor = z.enum([
  "blue",
  "teal",
  "green",
  "yellow",
  "red",
  "purple",
  "cyan",
]);
