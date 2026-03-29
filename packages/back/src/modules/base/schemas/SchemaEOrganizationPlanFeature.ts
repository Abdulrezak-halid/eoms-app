import { z } from "@hono/zod-openapi";

import { DataOrganizationPlanFeature } from "@m/base/interfaces/IOrganizationPlanFeature";

export const SchemaEOrganizationPlanFeature = z
  .enum(DataOrganizationPlanFeature)
  .openapi("IDtoEOrganizationPlanFeature");
