import { z } from "@hono/zod-openapi";

import { SchemaPlainOrTranslatableText } from "../schemas/SchemaTranslatableKeys";

export type IPlainOrTranslatableText = z.infer<
  typeof SchemaPlainOrTranslatableText
>;
