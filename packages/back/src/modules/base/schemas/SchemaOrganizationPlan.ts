import { z } from "@hono/zod-openapi";

import { SchemaEOrganizationPlanFeature } from "./SchemaEOrganizationPlanFeature";

export const SchemaOrganizationPlan = z.object({
  features: z.array(SchemaEOrganizationPlanFeature),
  maxUserCount: z.number().optional(),
});
