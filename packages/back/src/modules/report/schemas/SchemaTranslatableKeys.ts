import { z } from "@hono/zod-openapi";
import { MAX_REPORT_TEXT_STRING_LENGTH } from "common";

import { DataTranslatableKeys } from "../interfaces/ITranslatableKeys";

export const SchemaPlainOrTranslatableText = z
  .union([
    z.object({
      type: z.literal("PLAIN"),
      value: z.string().max(MAX_REPORT_TEXT_STRING_LENGTH),
    }),
    z.object({
      type: z.literal("TRANSLATED"),
      value: z.enum(DataTranslatableKeys).openapi("IDtoETranslationKeys"),
    }),
  ])
  .openapi("IDtoPlainOrTranslatableText");
