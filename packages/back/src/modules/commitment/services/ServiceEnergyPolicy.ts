import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { IPeriod } from "@m/commitment/interfaces/IPeriod";
import { TbEnergyPolicy } from "@m/commitment/orm/TbEnergyPolicy";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";

export namespace ServiceEnergyPolicy {
  export async function getAll(c: IContextCore, orgId: string) {
    return c.db
      .select({
        id: TbEnergyPolicy.id,
        content: TbEnergyPolicy.content,
        type: TbEnergyPolicy.type,
        period: TbEnergyPolicy.period,
        target: TbEnergyPolicy.target,
      })
      .from(TbEnergyPolicy)
      .where(eq(TbEnergyPolicy.orgId, orgId))
      .orderBy(TbEnergyPolicy.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      content: string;
      type: string | null;
      target: string | null;
      period: IPeriod;
    },
  ) {
    const [record] = await c.db
      .insert(TbEnergyPolicy)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        content: data.content,
        type: data.type,
        period: data.period,
        target: data.target,
      })
      .returning({ id: TbEnergyPolicy.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      content: string;
      type: string | null;
      target: string | null;
      period: IPeriod;
    },
  ) {
    await c.db
      .update(TbEnergyPolicy)
      .set({
        content: data.content,
        type: data.type,
        period: data.period,
        target: data.target,
      })
      .where(
        and(
          eq(TbEnergyPolicy.id, id),
          eq(TbEnergyPolicy.orgId, c.session.orgId),
        ),
      );
  }

  export async function get(c: IContextUser, id: string) {
    const [records] = await c.db
      .select({
        id: TbEnergyPolicy.id,
        content: TbEnergyPolicy.content,
        type: TbEnergyPolicy.type,
        period: TbEnergyPolicy.period,
        target: TbEnergyPolicy.target,
      })
      .from(TbEnergyPolicy)
      .where(
        and(
          eq(TbEnergyPolicy.orgId, c.session.orgId),
          eq(TbEnergyPolicy.id, id),
        ),
      );

    if (!records) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return records;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbEnergyPolicy)
      .where(
        and(
          eq(TbEnergyPolicy.orgId, c.session.orgId),
          eq(TbEnergyPolicy.id, id),
        ),
      );
  }
}
