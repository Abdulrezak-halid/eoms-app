import { z } from "@hono/zod-openapi";

import { DataOrganizationPartnerRelationType } from "../interfaces/IOrganizationPartnerRelationType";

export const SchemaOrganizationPartnerRelationType = z
  .enum(DataOrganizationPartnerRelationType)
  .openapi("IDtoEOrganizationPartnerRelationType");
