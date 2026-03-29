/**
 * @file: IInboundIntegrationConfig.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
