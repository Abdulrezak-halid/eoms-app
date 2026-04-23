import { z } from "@hono/zod-openapi";

import { DataMetricIntegrationPeriod } from "../interfaces/IMetricIntegrationPeriod";

export const SchemaEMetricIntegrationPeriod = z
  .enum(DataMetricIntegrationPeriod)
  .openapi("IDtoEMetricIntegrationPeriod");
