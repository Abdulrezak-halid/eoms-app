import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbEnpi } from "@m/analysis/orm/TbEnpi";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbSeu } from "@m/measurement/orm/TbSeu";

export namespace ServiceEnpi {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbEnpi.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        equipment: TbEnpi.equipment,
        targetedDate: TbEnpi.targetedDate,
        targetedImprovement: TbEnpi.targetedImprovement,
      })
      .from(TbEnpi)
      .innerJoin(TbSeu, eq(TbSeu.id, TbEnpi.seuId))
      .where(eq(TbEnpi.orgId, c.session.orgId))
      .orderBy(TbEnpi.createdAt);
  }

  export async function getNames(c: IContextUser) {
    return await c.db
      .select({
        id: TbEnpi.id,
        displayName: TbEnpi.equipment,
      })
      .from(TbEnpi)
      .where(eq(TbEnpi.orgId, c.session.orgId))
      .orderBy(TbEnpi.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      seuId: string;
      equipment: string;
      targetedDate: string;
      targetedImprovement: number;
    },
  ) {
    const [record] = await c.db
      .insert(TbEnpi)
      .values({
        orgId: c.session.orgId,
        seuId: data.seuId,
        equipment: data.equipment,
        targetedDate: data.targetedDate,
        targetedImprovement: data.targetedImprovement,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
      })
      .returning({ id: TbEnpi.id });
    return record.id;
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbEnpi.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        equipment: TbEnpi.equipment,
        targetedDate: TbEnpi.targetedDate,
        targetedImprovement: TbEnpi.targetedImprovement,
      })
      .from(TbEnpi)
      .innerJoin(TbSeu, eq(TbSeu.id, TbEnpi.seuId))
      .where(and(eq(TbEnpi.orgId, c.session.orgId), eq(TbEnpi.id, id)));
    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      seuId: string;
      equipment: string;
      targetedDate: string;
      targetedImprovement: number;
    },
  ) {
    await c.db
      .update(TbEnpi)
      .set({
        orgId: c.session.orgId,
        seuId: data.seuId,
        equipment: data.equipment,
        targetedDate: data.targetedDate,
        targetedImprovement: data.targetedImprovement,
      })
      .where(and(eq(TbEnpi.orgId, c.session.orgId), eq(TbEnpi.id, id)));
  }

  export async function remove(c: IContextUser, id: string) {
    return c.db
      .delete(TbEnpi)
      .where(and(eq(TbEnpi.orgId, c.session.orgId), eq(TbEnpi.id, id)));
  }
}
