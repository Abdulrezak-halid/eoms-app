import { EApiFailCode } from "common";
import { eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbOrganizationPartnerToken } from "../orm/TbOrganizationPartnerToken";
import { UtilToken } from "../utils/UtilToken";

export namespace ServiceOrganizationPartnerToken {
  export async function save(c: IContextUser) {
    const token = UtilToken.create(16);
    const result = await c.db
      .insert(TbOrganizationPartnerToken)
      .values({
        token,
        orgId: c.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .onConflictDoUpdate({
        target: TbOrganizationPartnerToken.orgId,
        set: { token, createdAt: c.nowDatetime, createdBy: c.session.userId },
      });

    if (!UtilDb.getAffectedRows(result)) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Generated token could not be saved.",
      );
    }

    return token;
  }

  export async function get(c: IContextUser) {
    const [rec] = await c.db
      .select({
        token: TbOrganizationPartnerToken.token,
        createdAt: UtilDb.isoDatetime(TbOrganizationPartnerToken.createdAt),
        createdBy: {
          id: TbOrganizationPartnerToken.createdBy,
          name: sqlUserDisplayName(),
        },
      })
      .from(TbOrganizationPartnerToken)
      .innerJoin(TbUser, eq(TbOrganizationPartnerToken.createdBy, TbUser.id))
      .where(eq(TbOrganizationPartnerToken.orgId, c.orgId))
      .limit(1);

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Organization partner token not found",
      );
    }

    return rec;
  }

  export async function remove(c: IContextUser) {
    await c.db
      .delete(TbOrganizationPartnerToken)
      .where(eq(TbOrganizationPartnerToken.orgId, c.orgId));
  }
}
