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
  orgDisplayName: SchemaString,
  orgPlan: SchemaOrganizationPlan,
  orgHasBanner: z.boolean(),
  permissions: z.array(SchemaEPermission),
  workerVersion: SchemaString,
  apiVersion: SchemaString,
  workerEnvName: SchemaString,
  buildTime: SchemaDatetime.optional(),
});
