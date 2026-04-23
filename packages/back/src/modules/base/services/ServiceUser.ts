/**
 * @file: ServiceUser.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.01.2025
 * Last Modified Date: 08.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode } from "common";
import { and, count, eq } from "drizzle-orm";

import { ROOT_ORG_USER_ID } from "@/constants";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { TbNotification } from "@m/core/orm/TbNotification";
import { ServiceNotification } from "@m/core/services/ServiceNotification";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilHash } from "@m/core/utils/UtilHash";

import { IPermission } from "../interfaces/IPermission";
import { TbUser, sqlUserDisplayName } from "../orm/TbUser";
import { TbUserPermission } from "../orm/TbUserPermission";
import { UtilOrganization } from "../utils/UtilOrganization";

export namespace ServiceUser {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbUser);
  }

  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbUser.id,
        email: TbUser.email,
        name: TbUser.name,
        surname: TbUser.surname,
        phone: TbUser.phone,
        position: TbUser.position,
        createdAt: UtilDb.isoDatetime(TbUser.createdAt),
        lastSessionAt: UtilDb.isoDatetime(TbUser.lastSessionAt),
      })
      .from(TbUser)
      .where(eq(TbUser.orgId, c.session.orgId))
      .orderBy(TbUser.createdAt);
  }

  export async function getDisplayNames(c: IContextUser) {
    return c.db
      .select({
        id: TbUser.id,
        displayName: sqlUserDisplayName(),
      })
      .from(TbUser)
      .where(eq(TbUser.orgId, c.session.orgId));
  }

  export async function getDisplayName(c: IContextUser, userId: string) {
    const [record] = await c.db
      .select({ displayName: sqlUserDisplayName() })
      .from(TbUser)
      .where(and(eq(TbUser.orgId, c.session.orgId), eq(TbUser.id, userId)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record.displayName;
  }

  export async function getPermissionsCore(
    c: IContextCore,
    orgId: string,
    userId: string,
  ) {
    const [record] = await c.db
      .select({
        permissions: UtilDb.arrayAgg(TbUserPermission.permission, {
          excludeNull: true,
        }),
      })
      .from(TbUserPermission)
      .where(
        and(
          eq(TbUserPermission.orgId, orgId),
          eq(TbUserPermission.userId, userId),
        ),
      );
    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "User permissions is not found.",
      );
    }
    return record.permissions;
  }

  export async function getPermissions(c: IContextUser, userId: string) {
    return await getPermissionsCore(c, c.session.orgId, userId);
  }

  export async function setPermission(
    c: IContextUser,
    userId: string,
    permission: IPermission,
    value: boolean,
  ) {
    if (value) {
      await c.db.insert(TbUserPermission).values({
        userId: userId,
        orgId: c.session.orgId,
        permission: permission,
      });
      return;
    }

    await c.db
      .delete(TbUserPermission)
      .where(
        and(
          eq(TbUserPermission.orgId, c.session.orgId),
          eq(TbUserPermission.userId, userId),
          eq(TbUserPermission.permission, permission),
        ),
      );
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbUser.id,
        email: TbUser.email,
        name: TbUser.name,
        surname: TbUser.surname,
        phone: TbUser.phone,
        position: TbUser.position,
      })
      .from(TbUser)
      .where(and(eq(TbUser.orgId, c.session.orgId), eq(TbUser.id, id)));

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function create(
    c: IContextUser,
    params: {
      email: string;
      name: string;
      surname?: string;
      phone?: string;
      position?: string;
      password: string;
    },
  ) {
    const [recUser] = await c.db
      .select({ count: count() })
      .from(TbUser)
      .where(eq(TbUser.orgId, c.session.orgId));

    if (
      !c.session.orgPlan.maxUserCount ||
      recUser.count >= c.session.orgPlan.maxUserCount
    ) {
      throw new ApiException(
        EApiFailCode.PLAN_LIMIT_EXCEEDED,
        "User limit for your plan has been reached.",
      );
    }

    const passwordHash = await UtilHash.sha256(params.password);
    const [record] = await c.db
      .insert(TbUser)
      .values({
        email: params.email,
        name: params.name,
        surname: params.surname,
        phone: params.phone,
        position: params.position,
        passwordHash,
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
      })
      .returning({ id: TbUser.id });

    await ServiceNotification.notifyUser(c, c.session.orgId, record.id, {
      type: "WELCOME",
    });

    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    params: {
      email: string;
      name: string;
      surname?: string;
      phone?: string;
      position?: string;
      password?: string;
    },
  ) {
    const passwordHash =
      params.password && (await UtilHash.sha256(params.password));
    await c.db
      .update(TbUser)
      .set({
        email: params.email,
        name: params.name,
        surname: params.surname || null,
        phone: params.phone || null,
        position: params.position || null,
        passwordHash,
      })
      .where(and(eq(TbUser.id, id), eq(TbUser.orgId, c.session.orgId)));
  }

  export async function updatePassword(c: IContextUser, password: string) {
    const passwordHash = await UtilHash.sha256(password);
    await c.db
      .update(TbUser)
      .set({ passwordHash })
      .where(eq(TbUser.id, c.session.userId));
  }

  export async function remove(c: IContextUser, id: string) {
    if (id === ROOT_ORG_USER_ID) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Root organization user cannot be deleted.",
      );
    }

    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbNotification)
        .where(
          and(eq(TbNotification.orgId, c.orgId), eq(TbNotification.userId, id)),
        );
      await tx
        .delete(TbUserPermission)
        .where(
          and(
            eq(TbUserPermission.orgId, c.session.orgId),
            eq(TbUserPermission.userId, id),
          ),
        );
      await tx
        .delete(TbUser)
        .where(and(eq(TbUser.orgId, c.session.orgId), eq(TbUser.id, id)));
    });
  }
}
