import { z } from "@hono/zod-openapi";
import { DataUnit } from "common";

// The interface is at common module, that's why openapi name is not set
export const SchemaEUnit = z.enum(DataUnit); //.openapi("IDtoEUnit");
