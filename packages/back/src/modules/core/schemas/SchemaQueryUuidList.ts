import { z } from "@hono/zod-openapi";

import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaQueryUuidList = z
  .string()
  .transform((value) => value.split(",").map((id) => id.trim()))
  .pipe(z.array(SchemaUuid));
