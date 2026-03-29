import { z } from "@hono/zod-openapi";
import { DataUnitGroup } from "common";

// The interface is at common module, that's why openapi name is not set
export const SchemaEUnitGroup = z.enum(DataUnitGroup); //.openapi("IDtoEUnitGroup");
