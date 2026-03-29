import { z } from "@hono/zod-openapi";

import { SchemaDate } from "@m/core/schemas/SchemaDate";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";
import { UtilArray } from "@m/core/utils/UtilArray";

import { SchemaReportSection } from "./SchemaReportSection";
import { SchemaPlainOrTranslatableText } from "./SchemaTranslatableKeys";

export const SchemaReport = z
  .object({
    title: SchemaPlainOrTranslatableText,
    dateStart: SchemaDate.optional(),
    dateEnd: SchemaDate.optional(),
    authorIds: UtilArray.zUniqueArray(SchemaUuid),
    sections: z.array(SchemaReportSection),
  })
  .openapi("IDtoReport");
