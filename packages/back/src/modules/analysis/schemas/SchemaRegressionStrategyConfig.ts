import { z } from "zod";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";

export const SchemaRegressionStrategyConfig = z.object({
  type: z.literal("EXPANDING_WINDOW"),
  datetimeStart: SchemaDatetime.nullable(),
});
