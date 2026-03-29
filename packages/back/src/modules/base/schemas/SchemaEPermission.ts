import { z } from "@hono/zod-openapi";

import { DataPermissions } from "@m/base/interfaces/IPermission";

export const SchemaEPermission = z
  .enum(DataPermissions)
  .openapi("IDtoEPermission");
