import { z } from "@hono/zod-openapi";

import { SchemaAgentStat } from "../schemas/SchemaAgentStat";

export type IAgentStat = z.infer<typeof SchemaAgentStat>;
