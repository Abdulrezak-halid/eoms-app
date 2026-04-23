import { z } from "@hono/zod-openapi";

import { DataSystemServiceStatus } from "../interfaces/ISystemServiceStatus";

export const SchemaESystemServiceStatus = z
  .enum(DataSystemServiceStatus)
  .openapi("IDtoESystemServiceStatus");
