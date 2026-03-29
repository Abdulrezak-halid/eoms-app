import { z } from "@hono/zod-openapi";

import { DataMetricType } from "../../measurement/interfaces/IMetricType";

export const SchemaEMetricType = z
  .enum(DataMetricType)
  .openapi("IDtoEMetricType");
