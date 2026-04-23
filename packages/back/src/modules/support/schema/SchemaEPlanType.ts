import { z } from "@hono/zod-openapi";

import { DataPlanType } from "../interfaces/IPlanType";

export const SchemaEPlanType = z.enum(DataPlanType).openapi("IDtoEPlanType");
