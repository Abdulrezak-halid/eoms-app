import { z } from "@hono/zod-openapi";

import {
  SchemaInboundIntegrationConfig,
  SchemaInboundIntegrationConfigGetter,
} from "../schemas/SchemaInboundIntegrationConfig";

export type IInboundIntegrationConfig = z.infer<
  typeof SchemaInboundIntegrationConfig
>;

export type IInboundIntegrationConfigGetter = z.infer<
  typeof SchemaInboundIntegrationConfigGetter
>;
