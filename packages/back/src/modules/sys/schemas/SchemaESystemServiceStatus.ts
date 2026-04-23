/**
 * @file: SchemaESystemServiceStatus.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2025
 * Last Modified Date: 06.11.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataSystemServiceStatus } from "../interfaces/ISystemServiceStatus";

export const SchemaESystemServiceStatus = z
  .enum(DataSystemServiceStatus)
  .openapi("IDtoESystemServiceStatus");
