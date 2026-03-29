import { z } from "@hono/zod-openapi";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";

export const SchemaEEnergyResource = z
  .enum(DataEnergyResource)
  .openapi("IDtoEEnergyResource");
