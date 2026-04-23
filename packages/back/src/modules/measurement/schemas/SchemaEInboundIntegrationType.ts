import { z } from "@hono/zod-openapi";

import { DataInboundIntegrationType } from "../interfaces/IInboundIntegrationType";

export const SchemaEInboundIntegrationType = z
  .enum(DataInboundIntegrationType)
  .openapi("IDtoEInboundIntegrationType");
