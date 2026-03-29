import { EApiFailCode } from "common";
import { EXAMPLE_USER_PASSWORD } from "common";
import { and, count, desc, eq, max, or } from "drizzle-orm";

import { ROOT_ORG_ID } from "@/constants";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { IOrganizationPlan } from "@m/base/interfaces/IOrganizationPlan";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { TbUserPermission } from "@m/base/orm/TbUserPermission";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { TbNotification } from "@m/core/orm/TbNotification";
import { ServiceNotification } from "@m/core/services/ServiceNotification";
import { UtilDb } from "@m/core/utils/UtilDb";
import { UtilHash } from "@m/core/utils/UtilHash";
import { TbReportProfile } from "@m/report/orm/TbReportProfile";

export namespace ServiceOrganization {
  export async function hasEnergyResource(
    c: IContextUser,
    energyResources: IEnergyResource[],
  ) {
    const config = await getConfig(c, c.session.orgId);

    const missing = energyResources.filter(
      (energyResource) => !config.energyResources.includes(energyResource),
    );

    if (missing.length) {
      throw new ApiException(EApiFailCode.FOREIGN_KEY_NOT_FOUND);
    }
  }

  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbOrganization.id,
        displayName: TbOrganization.displayName,
        fullName: TbOrganization.fullName,
        address: TbOrganization.address,
        phones: TbOrganization.phones,
        email: TbOrganization.email,
        config: TbOrganization.config,
        workspace: TbOrganization.workspace,
        plan: TbOrganization.plan,
        hasBanner: TbOrganization.hasBanner,
        createdAt: UtilDb.isoDatetime(TbOrganization.createdAt),
        userCount: count(TbUser.id),
        lastSessionAt: UtilDb.isoDatetime(max(TbUser.lastSessionAt)),
      })
      .from(TbOrganization)
      .leftJoin(TbUser, eq(TbUser.orgId, TbOrganization.id))
      .where(eq(TbOrganization.createdByOrgId, c.session.orgId))
      .groupBy(TbOrganization.id)
      .orderBy(desc(max(TbUser.lastSessionAt)));
  }

  export async function getUnsafe(c: IContextCore, id: string) {
    const [record] = await c.db
      .select({
        id: TbOrganization.id,
        displayName: TbOrganization.displayName,
        fullName: TbOrganization.fullName,
        address: TbOrganization.address,
        phones: TbOrganization.phones,
        email: TbOrganization.email,
        config: TbOrganization.config,
        workspace: TbOrganization.workspace,
        plan: TbOrganization.plan,
        hasBanner: TbOrganization.hasBanner,
      })
      .from(TbOrganization)
      .where(eq(TbOrganization.id, id));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbOrganization.id,
        displayName: TbOrganization.displayName,
        fullName: TbOrganization.fullName,
        address: TbOrganization.address,
        phones: TbOrganization.phones,
        email: TbOrganization.email,
        config: TbOrganization.config,
        workspace: TbOrganization.workspace,
        plan: TbOrganization.plan,
        hasBanner: TbOrganization.hasBanner,
      })
      .from(TbOrganization)
      .where(
        and(
          eq(TbOrganization.id, id),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );
    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function getNames(c: IContextUser) {
    return await c.db
      .select({
        id: TbOrganization.id,
        displayName: TbOrganization.displayName,
      })
      .from(TbOrganization)
      .where(eq(TbOrganization.createdByOrgId, c.session.orgId))
      .orderBy(TbOrganization.createdAt);
  }

  export async function create(
    c: IContextUser,
    params: {
      displayName: string;
      fullName: string;
      address: string;
      phones: string[];
      email: string;
      config: { energyResources: IEnergyResource[] };
      workspace: string;
      plan: IOrganizationPlan;
      adminEmail: string;
      adminName: string;
    },
  ) {
    // TODO random pass, display on front
    const passwordHash = await UtilHash.sha256(EXAMPLE_USER_PASSWORD);

    const [recOrg] = await c.db
      .insert(TbOrganization)
      .values({
        displayName: params.displayName,
        fullName: params.fullName,
        address: params.address,
        phones: params.phones,
        email: params.email,
        config: params.config,
        workspace: params.workspace,
        plan: params.plan,
        createdAt: c.nowDatetime,
        createdByOrgId: c.session.orgId,
        createdBy: c.session.userId,
      })
      .returning({ id: TbOrganization.id });

    if (!recOrg) {
      throw new ApiException(EApiFailCode.INTERNAL);
    }
    await c.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(TbUser)
        .values({
          orgId: recOrg.id,
          email: params.adminEmail,
          name: params.adminName,
          passwordHash,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbUser.id });
      await tx.insert(TbUserPermission).values({
        orgId: recOrg.id,
        userId: user.id,
        permission: "/",
      });

      await ServiceNotification.notifyUser(
        { ...c, db: tx },
        recOrg.id,
        user.id,
        {
          type: "WELCOME",
        },
      );
    });

    return recOrg.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    params: {
      displayName: string;
      fullName: string;
      address: string;
      phones: string[];
      email: string;
      config: { energyResources: IEnergyResource[] };
      workspace: string;
      plan: IOrganizationPlan;
    },
  ) {
    await c.db
      .update(TbOrganization)
      .set({
        displayName: params.displayName,
        fullName: params.fullName,
        address: params.address,
        phones: params.phones,
        email: params.email,
        config: params.config,
        workspace: params.workspace,
        plan: params.plan,
      })
      .where(
        and(
          eq(TbOrganization.id, id),
          eq(TbOrganization.createdByOrgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    if (id === ROOT_ORG_ID) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Root organization cannot be deleted.",
      );
    }

    await c.db.transaction(async (tx) => {
      await tx.delete(TbNotification).where(eq(TbNotification.orgId, id));
      await tx.delete(TbReportProfile).where(eq(TbReportProfile.orgId, id));
      await tx.delete(TbUserPermission).where(eq(TbUserPermission.orgId, id));
      await tx.delete(TbUser).where(eq(TbUser.orgId, id));
      await tx
        .delete(TbOrganization)
        .where(
          and(
            eq(TbOrganization.id, id),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        );
    });
  }

  export async function getConfig(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({ config: TbOrganization.config })
      .from(TbOrganization)
      .where(
        and(
          eq(TbOrganization.id, id),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec.config;
  }
}
