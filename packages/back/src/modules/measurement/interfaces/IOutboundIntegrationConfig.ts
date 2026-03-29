/**
 * @file: IOutboundIntegrationConfig.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaOutboundIntegrationConfig } from "../schemas/SchemaOutboundIntegrationConfig";

export type IOutboundIntegrationConfig = z.infer<
  typeof SchemaOutboundIntegrationConfig
>;
