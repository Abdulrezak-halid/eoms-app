import { z } from "@hono/zod-openapi";

import { DataAgentStatType } from "../interfaces/IAgentStatType";

export const SchemaEAgentStatType = z
  .enum(DataAgentStatType)
  .openapi("IDtoEAgentStatType");

export const SchemaEAgentStatTypeNullable =
  SchemaEAgentStatType.nullable().openapi("IDtoEAgentStatTypeNullable");
