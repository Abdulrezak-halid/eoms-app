import { z } from "@hono/zod-openapi";

import { SchemaOutboundIntegrationConfig } from "../schemas/SchemaOutboundIntegrationConfig";

export type IOutboundIntegrationConfig = z.infer<
  typeof SchemaOutboundIntegrationConfig
>;
