import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { ISession } from "../interfaces/ISession";
import { checkOrganizationPlanFeature } from "../middlewares/guardOrganizationPlanFeature";
import { checkPermission } from "../middlewares/guardPermission";
import { TbOrganization } from "../orm/TbOrganization";
import { TbUserPermission } from "../orm/TbUserPermission";
import { TbUserToken } from "../orm/TbUserToken";
import { UtilOrganization } from "../utils/UtilOrganization";
import { UtilToken } from "../utils/UtilToken";

export namespace ServiceUserToken {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbUserToken);
  }

  export async function getSession(
    c: IContextCore,
    token: string,
  ): Promise<ISession | null> {
    const [record] = await c.db
      .select({
        orgId: TbOrganization.id,
        orgPlan: TbOrganization.plan,
        userId: TbUserToken.createdBy,
        permissions: UtilDb.arrayAgg(TbUserPermission.permission, {
          excludeNull: true,
        }),
      })
      .from(TbUserToken)
      .where(eq(TbUserToken.token, token))
      .leftJoin(
        TbUserPermission,
        eq(TbUserPermission.userId, TbUserToken.createdBy),
      )
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUserToken.orgId))
      .groupBy(TbOrganization.id, TbUserToken.createdBy);

    if (!record) {
      return null;
    }

    checkOrganizationPlanFeature(record.orgPlan.features, "USER_TOKEN");
    checkPermission(record.permissions, "/BASE/USER_TOKEN");

    return {
      isUserToken: true,
      token,
      orgId: record.orgId,
      userId: record.userId,
      permissions: record.permissions,
      orgPlan: record.orgPlan,
    };
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbUserToken.id,
        name: TbUserToken.name,
        token: TbUserToken.token,
      })
      .from(TbUserToken)

      .where(eq(TbUserToken.orgId, c.session.orgId))
      .groupBy(TbUserToken.id, TbUserToken.token)
      .orderBy(TbUserToken.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbUserToken.id,
        name: TbUserToken.name,
        token: TbUserToken.token,
      })
      .from(TbUserToken)
      .where(
        and(eq(TbUserToken.orgId, c.session.orgId), eq(TbUserToken.id, id)),
      )
      .groupBy(TbUserToken.id);

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const token = UtilToken.create(32);

      const [record] = await tx
        .insert(TbUserToken)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name: data.name,
          token,
        })
        .returning({ id: TbUserToken.id });

      return { id: record.id, token };
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
    },
  ) {
    const [record] = await c.db
      .update(TbUserToken)
      .set({
        name: data.name,
      })
      .where(
        and(eq(TbUserToken.id, id), eq(TbUserToken.orgId, c.session.orgId)),
      )
      .returning({ id: TbUserToken.id });

    if (!record) {
      throw new ApiException(EApiFailCode.BAD_REQUEST);
    }
    return record;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbUserToken)
      .where(
        and(eq(TbUserToken.orgId, c.session.orgId), eq(TbUserToken.id, id)),
      );
  }
}
