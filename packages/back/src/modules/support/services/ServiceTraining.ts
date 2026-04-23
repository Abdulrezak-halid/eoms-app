import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextUser } from "@m/core/interfaces/IContext";

import type { ITrainingCategory } from "../../support/interfaces/ITrainingCategory";
import { TbTraining } from "../orm/TbTraining";

export namespace ServiceTraining {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbTraining.id,
        title: TbTraining.title,
        date: TbTraining.date,
        category: TbTraining.category,
        trainerUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
      })
      .from(TbTraining)
      .innerJoin(TbUser, eq(TbUser.id, TbTraining.trainerUserId))
      .where(eq(TbTraining.orgId, c.session.orgId))
      .orderBy(TbTraining.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      title: string;
      date: string;
      category: ITrainingCategory;
      trainerUserId: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbTraining)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        title: data.title,
        trainerUserId: data.trainerUserId,
        category: data.category,
        date: data.date,
      })
      .returning({ id: TbTraining.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      title: string;
      date: string;
      category: ITrainingCategory;
      trainerUserId: string;
    },
  ) {
    await c.db
      .update(TbTraining)
      .set({
        title: data.title,
        trainerUserId: data.trainerUserId,
        category: data.category,
        date: data.date,
      })
      .where(and(eq(TbTraining.id, id), eq(TbTraining.orgId, c.session.orgId)));
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbTraining.id,
        title: TbTraining.title,
        trainerUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        category: TbTraining.category,
        date: TbTraining.date,
      })
      .from(TbTraining)
      .innerJoin(TbUser, eq(TbUser.id, TbTraining.trainerUserId))
      .where(and(eq(TbTraining.orgId, c.session.orgId), eq(TbTraining.id, id)));
    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbTraining)
      .where(and(eq(TbTraining.orgId, c.session.orgId), eq(TbTraining.id, id)));
  }
}
