/**
 * @file: SchemaEOrganizationPlanFeature.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 26.03.2025
 * Last Modified Date: 26.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataOrganizationPlanFeature } from "@m/base/interfaces/IOrganizationPlanFeature";

export const SchemaEOrganizationPlanFeature = z
  .enum(DataOrganizationPlanFeature)
  .openapi("IDtoEOrganizationPlanFeature");
