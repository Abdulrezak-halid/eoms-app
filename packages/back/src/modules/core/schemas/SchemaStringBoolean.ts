import { z } from "@hono/zod-openapi";

export const SchemaStringBoolean = z
  .enum(["true", "false"])
  .transform((val) => val === "true");
