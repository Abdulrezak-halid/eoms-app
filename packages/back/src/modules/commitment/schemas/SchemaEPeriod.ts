import { z } from "@hono/zod-openapi";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";

export const SchemaEPeriod = z.enum(DataPeriod).openapi("IDtoEPeriod");
