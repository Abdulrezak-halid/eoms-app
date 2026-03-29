/**
 * @file: SchemaEOutboundIntegrationType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataOutboundIntegrationType } from "../interfaces/IOutboundIntegrationType";

export const SchemaEOutboundIntegrationType = z
  .enum(DataOutboundIntegrationType)
  .openapi("IDtoEOutboundIntegrationType");
