import { z } from "@hono/zod-openapi";

import { DataMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";

export const SchemaEMetricResourceValuePeriod = z
  .enum(DataMetricResourceValuePeriod)
  .openapi("IDtoEMetricResourceValuePeriod");
