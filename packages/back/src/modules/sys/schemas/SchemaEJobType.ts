import { z } from "@hono/zod-openapi";

export const SchemaEJobType = z
  .enum(["CRON", "ONE_TIME", "IMMEDIATE"])
  .openapi("IDtoEJobType");
