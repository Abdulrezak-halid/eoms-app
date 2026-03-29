import { sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

import { IOrganizationPartnerRelationType } from "../interfaces/IOrganizationPartnerRelationType";
import { TbOrganizationPartner } from "../orm/TbOrganizationPartner";

export const VwOrganizationPartner = pgView("vw_organization_partner").as(
  (qb) => {
    const owner = qb
      .select({
        orgId: sql<string>`${TbOrganizationPartner.orgTokenOwnerId}`.as(
          "orgId",
        ),
        partnerId: sql<string>`${TbOrganizationPartner.orgTokenUserId}`.as(
          "partnerId",
        ),
        relationType: sql<IOrganizationPartnerRelationType>`'TOKEN_USER'`.as(
          "relationType",
        ),
        createdAt: TbOrganizationPartner.createdAt,
      })
      .from(TbOrganizationPartner);

    const user = qb
      .select({
        orgId: sql<string>`${TbOrganizationPartner.orgTokenUserId}`.as("orgId"),
        partnerId: sql<string>`${TbOrganizationPartner.orgTokenOwnerId}`.as(
          "partnerId",
        ),
        relationType: sql<IOrganizationPartnerRelationType>`'TOKEN_OWNER'`.as(
          "relationType",
        ),
        createdAt: TbOrganizationPartner.createdAt,
      })
      .from(TbOrganizationPartner);

    return owner.unionAll(user);
  },
);
