import { z } from "zod";

import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaRegressionSuggestionDriver = z.object({
  selected_feature_ids: SchemaUuid.array(),
  target_id: SchemaUuid,
});
