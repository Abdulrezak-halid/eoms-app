import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { IPeriod } from "@m/commitment/interfaces/IPeriod";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbSeu } from "@m/measurement/orm/TbSeu";
import { TbMaintenanceActivity } from "@m/support/orm/TbMaintenanceActivity";

export namespace ServiceMaintenanceActivity {
  export async function getAll(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbMaintenanceActivity.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        task: TbMaintenanceActivity.task,
        period: TbMaintenanceActivity.period,
        lastMaintainedAt: TbMaintenanceActivity.lastMaintainedAt,
        responsibleUser: {
          id: TbUser.id,
          name: sqlUserDisplayName(),
        },
        note: TbMaintenanceActivity.note,
      })
      .from(TbMaintenanceActivity)
      .innerJoin(TbSeu, eq(TbSeu.id, TbMaintenanceActivity.seuId))
      .innerJoin(TbUser, eq(TbUser.id, TbMaintenanceActivity.responsibleUserId))
      .where(eq(TbMaintenanceActivity.orgId, c.session.orgId))
      .orderBy(TbMaintenanceActivity.createdAt);
    return { records };
  }

  export async function create(
    c: IContextUser,
    data: {
      seuId: string;
      task: string;
      period: IPeriod;
      lastMaintainedAt: string;
      responsibleUserId: string;
      note: string | null;
    },
  ) {
    const [record] = await c.db
      .insert(TbMaintenanceActivity)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        seuId: data.seuId,
        task: data.task,
        period: data.period,
        lastMaintainedAt: data.lastMaintainedAt,
        responsibleUserId: data.responsibleUserId,
        note: data.note,
      })
      .returning({ id: TbMaintenanceActivity.id });
    return record.id;
  }

  export async function get(c: IContextUser, id: string) {
    const [records] = await c.db
      .select({
        id: TbMaintenanceActivity.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        task: TbMaintenanceActivity.task,
        period: TbMaintenanceActivity.period,
        lastMaintainedAt: TbMaintenanceActivity.lastMaintainedAt,
        responsibleUser: {
          id: TbUser.id,
          name: sqlUserDisplayName(),
        },
        note: TbMaintenanceActivity.note,
      })
      .from(TbMaintenanceActivity)
      .innerJoin(TbSeu, eq(TbSeu.id, TbMaintenanceActivity.seuId))
      .innerJoin(TbUser, eq(TbUser.id, TbMaintenanceActivity.responsibleUserId))
      .where(
        and(
          eq(TbMaintenanceActivity.id, id),
          eq(TbMaintenanceActivity.orgId, c.session.orgId),
        ),
      );
    if (!records) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return records;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      seuId: string;
      task: string;
      period: IPeriod;
      lastMaintainedAt: string;
      responsibleUserId: string;
      note: string | null;
    },
  ) {
    const [record] = await c.db
      .update(TbMaintenanceActivity)
      .set({
        seuId: data.seuId,
        task: data.task,
        period: data.period,
        lastMaintainedAt: data.lastMaintainedAt,
        responsibleUserId: data.responsibleUserId,
        note: data.note,
      })
      .where(
        and(
          eq(TbMaintenanceActivity.id, id),
          eq(TbMaintenanceActivity.orgId, c.session.orgId),
        ),
      )
      .returning({ id: TbMaintenanceActivity.id });
    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function remove(c: IContextUser, id: string) {
    return c.db
      .delete(TbMaintenanceActivity)
      .where(
        and(
          eq(TbMaintenanceActivity.id, id),
          eq(TbMaintenanceActivity.orgId, c.session.orgId),
        ),
      );
  }
}
