import { z } from "@hono/zod-openapi";

import { SchemaMetricResourceLabelUserDefined } from "./SchemaMetricResourceLabel";
import { SchemaTimedValue } from "./SchemaTimedValueList";

export const SchemaMetricFileDraftContentRecord = SchemaTimedValue.extend({
  labels: z.array(SchemaMetricResourceLabelUserDefined),
}).openapi("IDtoMetricFileDraftContentRecord");
