import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { TbPlan } from "../orm/TbPlan";

export namespace ServicePlan {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbPlan.id,
        name: TbPlan.name,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        scheduleDate: TbPlan.scheduleDate,
      })
      .from(TbPlan)
      .innerJoin(TbSeu, eq(TbSeu.id, TbPlan.seuId))
      .innerJoin(TbUser, eq(TbUser.id, TbPlan.responsibleUserId))
      .where(eq(TbPlan.orgId, c.session.orgId))
      .orderBy(TbPlan.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbPlan.id,
        name: TbPlan.name,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        scheduleDate: TbPlan.scheduleDate,
      })
      .from(TbPlan)
      .innerJoin(TbSeu, eq(TbSeu.id, TbPlan.seuId))
      .innerJoin(TbUser, eq(TbUser.id, TbPlan.responsibleUserId))
      .where(and(eq(TbPlan.orgId, c.session.orgId), eq(TbPlan.id, id)));

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }
  export async function create(
    c: IContextUser,
    data: {
      seuId: string;
      name: string;
      responsibleUserId: string;
      scheduleDate: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbPlan)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        seuId: data.seuId,
        name: data.name,
        responsibleUserId: data.responsibleUserId,
        scheduleDate: data.scheduleDate,
      })
      .returning({ id: TbPlan.id });
    return record.id;
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      seuId: string;
      name: string;
      responsibleUserId: string;
      scheduleDate: string;
    },
  ) {
    await c.db
      .update(TbPlan)
      .set({
        seuId: data.seuId,
        name: data.name,
        responsibleUserId: data.responsibleUserId,
        scheduleDate: data.scheduleDate,
      })
      .where(and(eq(TbPlan.orgId, c.session.orgId), eq(TbPlan.id, id)));
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbPlan)
      .where(and(eq(TbPlan.orgId, c.session.orgId), eq(TbPlan.id, id)));
  }
}
