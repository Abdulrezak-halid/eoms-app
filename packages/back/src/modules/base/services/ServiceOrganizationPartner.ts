import { EApiFailCode } from "common";
import { and, eq, ne, or } from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg } from "@m/core/interfaces/IContext";
import { ServiceNotification } from "@m/core/services/ServiceNotification";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbOrganizationPartner } from "../orm/TbOrganizationPartner";
import { TbOrganizationPartnerToken } from "../orm/TbOrganizationPartnerToken";
import { VwOrganizationPartner } from "../orm/VwOrganizationPartner";

export namespace ServiceOrganizationPartner {
  export async function create(c: IContextOrg, token: string) {
    const [recOwner] = await c.db
      .select({
        orgId: TbOrganizationPartnerToken.orgId,
        displayName: TbOrganization.displayName,
      })
      .from(TbOrganizationPartnerToken)
      .innerJoin(
        TbOrganization,
        eq(TbOrganization.id, TbOrganizationPartnerToken.orgId),
      )
      .where(
        and(
          ne(TbOrganizationPartnerToken.orgId, c.orgId),
          eq(TbOrganizationPartnerToken.token, token),
        ),
      )
      .limit(1);

    if (!recOwner) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "This token does not belong to any organization.",
      );
    }

    await ServiceNotification.notifyOrganization(c, recOwner.orgId, {
      type: "PARTNERSHIP_CREATED",
      organizationName: recOwner.displayName,
    });

    await c.db.insert(TbOrganizationPartner).values({
      orgTokenOwnerId: recOwner.orgId,
      orgTokenUserId: c.orgId,
      createdAt: c.nowDatetime,
    });
  }

  export async function getAll(c: IContextOrg) {
    return c.db
      .select({
        partnerId: VwOrganizationPartner.partnerId,
        relationType: VwOrganizationPartner.relationType,
        displayName: TbOrganization.displayName,
        hasBanner: TbOrganization.hasBanner,
      })
      .from(VwOrganizationPartner)
      .innerJoin(
        TbOrganization,
        eq(TbOrganization.id, VwOrganizationPartner.partnerId),
      )
      .where(eq(VwOrganizationPartner.orgId, c.orgId));
  }

  export async function get(c: IContextOrg, partnerId: string) {
    const [rec] = await c.db
      .select({
        partnerId: TbOrganization.id,
        relationType: VwOrganizationPartner.relationType,
        createdAt: UtilDb.isoDatetime(TbOrganization.createdAt),
        hasBanner: TbOrganization.hasBanner,
        displayName: TbOrganization.displayName,
        fullName: TbOrganization.fullName,
        address: TbOrganization.address,
        phones: TbOrganization.phones,
        email: TbOrganization.email,
      })
      .from(VwOrganizationPartner)
      .innerJoin(
        TbOrganization,
        eq(TbOrganization.id, VwOrganizationPartner.partnerId),
      )
      .where(
        and(
          eq(VwOrganizationPartner.orgId, c.orgId),
          eq(VwOrganizationPartner.partnerId, partnerId),
        ),
      )
      .limit(1);

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Organization is not found",
      );
    }

    return rec;
  }

  export async function remove(c: IContextOrg, partnerId: string) {
    await c.db
      .delete(TbOrganizationPartner)
      .where(
        or(
          and(
            eq(TbOrganizationPartner.orgTokenUserId, c.orgId),
            eq(TbOrganizationPartner.orgTokenOwnerId, partnerId),
          ),
          and(
            eq(TbOrganizationPartner.orgTokenOwnerId, c.orgId),
            eq(TbOrganizationPartner.orgTokenUserId, partnerId),
          ),
        ),
      );
  }
}
