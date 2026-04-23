import { EApiFailCode } from "common";
import { and, count, eq, inArray, or } from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbAgent } from "../orm/TbAgent";

export namespace ServiceAgent {
  export async function checkAssignedOrgOwnership(
    c: IContextUser,
    ids: string[],
  ) {
    if (!ids.length) {
      return;
    }
    const uniqueIds = [...new Set(ids)];

    const [row] = await c.db
      .select({ count: count() })
      .from(TbOrganization)
      .where(
        and(
          inArray(TbOrganization.id, uniqueIds),
          or(
            eq(TbOrganization.id, c.session.orgId),
            eq(TbOrganization.createdByOrgId, c.session.orgId),
          ),
        ),
      );

    if (row.count !== uniqueIds.length) {
      throw new ApiException(EApiFailCode.FOREIGN_KEY_NOT_FOUND);
    }
  }

  export async function getAllByAssignedOrgId(c: IContextUser) {
    return await c.db
      .select({
        id: TbAgent.id,
        name: TbAgent.name,
        serialNo: TbAgent.serialNo,
        description: TbAgent.description,
        statType: TbAgent.statType,
        datetimeStat: UtilDb.isoDatetime(TbAgent.datetimeStat),
      })
      .from(TbAgent)
      .where(eq(TbAgent.assignedOrgId, c.session.orgId))
      .orderBy(TbAgent.createdAt);
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbAgent.id,
        name: TbAgent.name,
        serialNo: TbAgent.serialNo,
        description: TbAgent.description,
        assignedOrg: {
          id: TbOrganization.id,
          displayName: TbOrganization.displayName,
        },
        statType: TbAgent.statType,
        datetimeStat: UtilDb.isoDatetime(TbAgent.datetimeStat),
      })
      .from(TbAgent)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbAgent.assignedOrgId))
      .where(eq(TbAgent.orgId, c.session.orgId))
      .orderBy(TbAgent.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbAgent.id,
        name: TbAgent.name,
        serialNo: TbAgent.serialNo,
        description: TbAgent.description,
        assignedOrg: {
          id: TbOrganization.id,
          displayName: TbOrganization.displayName,
        },
      })
      .from(TbAgent)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbAgent.assignedOrgId))
      .where(and(eq(TbAgent.id, id), eq(TbAgent.orgId, c.session.orgId)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }

  export async function getStats(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbAgent.id,
        name: TbAgent.name,
        serialNo: TbAgent.serialNo,
        description: TbAgent.description,
        stats: TbAgent.stats,
        statType: TbAgent.statType,
        datetimeStat: UtilDb.isoDatetime(TbAgent.datetimeStat),
      })
      .from(TbAgent)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbAgent.assignedOrgId))
      .where(and(eq(TbAgent.orgId, c.session.orgId), eq(TbAgent.id, id)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      serialNo: string;
      description: string | null;
      assignedOrgId: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbAgent)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        assignedOrgId: data.assignedOrgId,
        name: data.name,
        serialNo: data.serialNo,
        description: data.description,
      })
      .returning({ id: TbAgent.id });

    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      serialNo: string;
      description: string | null;
      assignedOrgId: string;
    },
  ) {
    const [record] = await c.db
      .update(TbAgent)
      .set({
        name: data.name,
        serialNo: data.serialNo,
        description: data.description,
        assignedOrgId: data.assignedOrgId,
      })
      .where(and(eq(TbAgent.id, id), eq(TbAgent.orgId, c.session.orgId)))
      .returning({ id: TbAgent.id });

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbAgent)
      .where(and(eq(TbAgent.orgId, c.session.orgId), eq(TbAgent.id, id)));
  }
}
