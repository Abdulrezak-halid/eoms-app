/**
 * @file: SchemaEAgentStatType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataAgentStatType } from "../interfaces/IAgentStatType";

export const SchemaEAgentStatType = z
  .enum(DataAgentStatType)
  .openapi("IDtoEAgentStatType");

export const SchemaEAgentStatTypeNullable =
  SchemaEAgentStatType.nullable().openapi("IDtoEAgentStatTypeNullable");
