/**
 * @file: SchemaEInboundIntegrationType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.06.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataInboundIntegrationType } from "../interfaces/IInboundIntegrationType";

export const SchemaEInboundIntegrationType = z
  .enum(DataInboundIntegrationType)
  .openapi("IDtoEInboundIntegrationType");
