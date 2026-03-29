/**
 * @file: SchemaOrganizationPartnerRelationType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.02.2026
 * Last Modified Date: 05.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataOrganizationPartnerRelationType } from "../interfaces/IOrganizationPartnerRelationType";

export const SchemaOrganizationPartnerRelationType = z
  .enum(DataOrganizationPartnerRelationType)
  .openapi("IDtoEOrganizationPartnerRelationType");
