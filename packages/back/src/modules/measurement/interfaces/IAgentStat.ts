/**
 * @file: IAgentStat.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaAgentStat } from "../schemas/SchemaAgentStat";

export type IAgentStat = z.infer<typeof SchemaAgentStat>;
