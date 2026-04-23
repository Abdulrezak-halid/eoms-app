/**
 * @file: SchemaSessionDetail.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.11.2024
 * Last Modified Date: 06.12.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { SchemaDatetime } from "@m/core/schemas/SchemaDatetime";
import { SchemaEmail } from "@m/core/schemas/SchemaEmail";
import { SchemaString } from "@m/core/schemas/SchemaString";
import { SchemaUuid } from "@m/core/schemas/SchemaUuid";

import { SchemaEPermission } from "./SchemaEPermission";
import { SchemaOrganizationPlan } from "./SchemaOrganizationPlan";

export const SchemaSessionDetail = z.object({
  userId: SchemaUuid,
  userDisplayName: SchemaString,
  userEmail: SchemaEmail,
  orgId: SchemaUuid,
  orgEmail: SchemaEmail,
  orgDisplayName: SchemaString,
  orgPlan: SchemaOrganizationPlan,
  orgHasBanner: z.boolean(),
  permissions: z.array(SchemaEPermission),
  workerVersion: SchemaString,
  apiVersion: SchemaString,
  workerEnvName: SchemaString,
  buildTime: SchemaDatetime.optional(),
});
