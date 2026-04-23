import { z } from "@hono/zod-openapi";

import { DataOutboundIntegrationType } from "../interfaces/IOutboundIntegrationType";

export const SchemaEOutboundIntegrationType = z
  .enum(DataOutboundIntegrationType)
  .openapi("IDtoEOutboundIntegrationType");
