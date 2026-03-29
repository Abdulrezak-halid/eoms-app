/**
 * @file: ServiceSession.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.12.2024
 * Last Modified Date: 10.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { EApiFailCode, VERSION_API } from "common";
import { and, eq, ne, sql } from "drizzle-orm";
import type { Context } from "hono";

import { VERSION } from "@/constants";

import { ApiException } from "@m/core/exceptions/ApiException";
import type {
  IContextCore,
  IHonoContextCore,
  IHonoContextUser,
} from "@m/core/interfaces/IContext";
import { ServiceCookie } from "@m/core/services/ServiceCookie";
import { ServiceMaintenance } from "@m/core/services/ServiceMaintenance";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilHash } from "@m/core/utils/UtilHash";

import type { IOrganizationPlan } from "../interfaces/IOrganizationPlan";
import { IPermission } from "../interfaces/IPermission";
import type { ISession } from "../interfaces/ISession";
import { TbOrganization } from "../orm/TbOrganization";
import { TbUser, sqlUserDisplayName } from "../orm/TbUser";
import { TbUserPermission } from "../orm/TbUserPermission";
import { TbUserSession } from "../orm/TbUserSession";
import { ServiceUserToken } from "./ServiceUserToken";

/**
 * Difference between db/cookie session vs front session object is;
 * - Db/cookie session has information that's used in many places.
 *     Examples; userId, permissions, orgPlan.
 * - Front session object contains information initialize data.
 *     Examples; user display name, organization name.
 */

const HEADER_USER_TOKEN = "X-Token";

export namespace ServiceSession {
  export async function login(
    c: Context<IHonoContextCore>,
    params: { email: string; password: string; workspace: string | null },
  ) {
    const passwordHash = await UtilHash.sha256(params.password);

    const filters = [
      eq(TbUser.email, params.email),
      eq(TbUser.passwordHash, passwordHash),
    ];

    if (params.workspace) {
      filters.push(eq(TbOrganization.workspace, params.workspace));
    }

    const [rec] = await c.var.db
      .select({
        userId: TbUser.id,
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUser.orgId))
      .where(and(...filters));

    if (!rec) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Username, password, or workspace does not match.",
      );
    }

    // Note: This usage ("ServiceSession.create" not only "create")
    //   is on purpose. "create" method is mocked in test environment.
    //   To call mocked version, need to access through "ServiceSession".
    const { token, sessionData } = await ServiceSession.create(
      c.var,
      rec.userId,
    );

    if (!sessionData.orgPlan.features.includes("SYSTEM")) {
      const maintenance = await ServiceMaintenance.get(c.var);
      if (maintenance) {
        throw new ApiException(
          EApiFailCode.MAINTENANCE,
          "The system is under maintenance. Please try again later.",
        );
      }
    }

    await updateLastSession(c.var, rec.userId);

    return { userId: rec.userId, token };
  }

  export async function find(c: Context<IHonoContextCore>) {
    let session: ISession | null;

    const userToken = c.req.header(HEADER_USER_TOKEN);

    if (userToken) {
      session = await ServiceUserToken.getSession(c.var, userToken);
    } else {
      const token = await ServiceCookie.get(c);
      if (!token) {
        return null;
      }
      session = await ServiceSession.get(c.var, token);
    }

    if (!session) {
      return null;
    }

    return await ServiceSession.getUserData(c.var, session.userId);
  }

  export async function updateLastSession(c: IContextCore, userId: string) {
    await c.db
      .update(TbUser)
      .set({ lastSessionAt: c.nowDatetime })
      .where(eq(TbUser.id, userId));
  }

  export async function getUserData(c: IContextCore, userId: string) {
    const [rec] = await c.db
      .select({
        user: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
          email: TbUser.email,
          permissions: sql<IPermission[]>`${c.db
            .select({
              permissions: UtilDb.arrayAgg(TbUserPermission.permission),
            })
            .from(TbUserPermission)
            .where(
              and(
                eq(TbUserPermission.orgId, TbUser.orgId),
                eq(TbUserPermission.userId, TbUser.id),
              ),
            )}`,
        },
        org: {
          id: TbOrganization.id,
          displayName: TbOrganization.displayName,
          plan: TbOrganization.plan,
          hasBanner: TbOrganization.hasBanner,
        },
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUser.orgId))
      .where(eq(TbUser.id, userId));

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "User is not found to get session details.",
      );
    }

    return {
      userId: rec.user.id,
      userDisplayName: rec.user.displayName,
      userEmail: rec.user.email,
      orgId: rec.org.id,
      orgDisplayName: rec.org.displayName,
      orgPlan: rec.org.plan,
      orgHasBanner: rec.org.hasBanner,
      permissions: rec.user.permissions,
      workerVersion: VERSION,
      apiVersion: VERSION_API,
      workerEnvName: c.env.ENV_NAME,
      buildTime: c.env.BUILD_TIME,
    };
  }

  export async function create(
    c: IContextCore,
    userId: string,
    options?: {
      overwrittenPermissions?: IPermission[];
      overwrittenOrganizationPlan?: IOrganizationPlan;
    },
  ) {
    const [rec] = await c.db
      .select({
        userId: TbUser.id,
        orgId: TbOrganization.id,
        ...(options?.overwrittenPermissions
          ? {}
          : {
              permissions: sql<IPermission[]>`${c.db
                .select({
                  permission: UtilDb.arrayAgg(TbUserPermission.permission),
                })
                .from(TbUserPermission)
                .where(
                  and(
                    eq(TbUserPermission.orgId, TbUser.orgId),
                    eq(TbUserPermission.userId, TbUser.id),
                  ),
                )}`,
            }),
        ...(options?.overwrittenOrganizationPlan
          ? {}
          : { orgPlan: TbOrganization.plan }),
      })
      .from(TbUser)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbUser.orgId))
      .where(eq(TbUser.id, userId));

    if (!rec) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "User info is not found to create session",
      );
    }

    const sessionData = {
      userId: rec.userId,
      orgId: rec.orgId,
      permissions: options?.overwrittenPermissions || rec.permissions || [],
      orgPlan: options?.overwrittenOrganizationPlan ||
        rec.orgPlan || { features: [] },
    };

    const [recSession] = await c.db
      .insert(TbUserSession)
      .values({
        ...sessionData,
        createdAt: c.nowDatetime,
      })
      .returning({ token: TbUserSession.token });

    if (!recSession) {
      throw new ApiException(
        EApiFailCode.INTERNAL,
        "Failed to create session.",
      );
    }

    return { token: recSession.token, sessionData };
  }

  export async function get(
    c: IContextCore,
    token: string,
  ): Promise<ISession | null> {
    const [rec] = await c.db
      .select({
        token: TbUserSession.token,
        orgId: TbUserSession.orgId,
        userId: TbUserSession.userId,
        permissions: TbUserSession.permissions,
        orgPlan: TbUserSession.orgPlan,
      })
      .from(TbUserSession)
      .where(eq(TbUserSession.token, token));

    return rec || null;
  }

  export async function validateAndGetSession(
    c: Context<IHonoContextCore> | Context<IHonoContextUser>,
  ) {
    let session: ISession | null;

    const userToken = c.req.header(HEADER_USER_TOKEN);
    if (userToken) {
      session = await ServiceUserToken.getSession(c.var, userToken);
    } else {
      const token = await ServiceCookie.get(c);
      if (!token) {
        throw new ApiException(
          EApiFailCode.UNAUTHORIZED,
          "Unauthorized: No session token provided.",
        );
      }
      session = await ServiceSession.get(c.var, token);
    }

    if (!session) {
      throw new ApiException(
        EApiFailCode.UNAUTHORIZED,
        "Unauthorized: Invalid or expired session token.",
      );
    }

    if (!session.orgPlan.features.includes("SYSTEM")) {
      const maintenance = await ServiceMaintenance.get(c.var);
      if (maintenance) {
        throw new ApiException(
          EApiFailCode.MAINTENANCE,
          "The system is under maintenance. Please try again later.",
        );
      }
    }

    return session;
  }

  export async function updatePermissions(
    c: IContextCore,
    token: string,
    permissions: IPermission[],
  ) {
    await c.db.transaction(async (tx) => {
      const [rec] = await tx
        .update(TbUserSession)
        .set({
          permissions,
        })
        .where(eq(TbUserSession.token, token))
        .returning({ userId: TbUserSession.userId });

      if (!rec) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Session is not found to update permissions.",
        );
      }

      // Drop other sessions
      await tx
        .delete(TbUserSession)
        .where(
          and(
            ne(TbUserSession.token, token),
            eq(TbUserSession.userId, rec.userId),
          ),
        );
    });
  }

  export async function remove(c: IContextCore, token: string) {
    await c.db.delete(TbUserSession).where(eq(TbUserSession.token, token));
  }

  export async function removeByUserId(c: IContextCore, userId: string) {
    await c.db.delete(TbUserSession).where(eq(TbUserSession.userId, userId));
  }

  export async function removeAllByOrgId(c: IContextCore, orgId: string) {
    await c.db.delete(TbUserSession).where(eq(TbUserSession.orgId, orgId));
  }

  export async function removeAll(c: IContextCore) {
    await c.db.delete(TbUserSession);
  }
}
