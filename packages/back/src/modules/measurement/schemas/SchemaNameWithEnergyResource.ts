import { z } from "@hono/zod-openapi";

import { SchemaEEnergyResource } from "@m/base/schemas/SchemaEEnergyResource";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

export const SchemaNameWithEnergyResource = z.object({
  id: SchemaUuid,
  name: SchemaString,
  energyResource: SchemaEEnergyResource,
});
