import { EApiFailCode, IUnitGroup } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbProduct } from "../orm/TbProduct";

export namespace ServiceProduct {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbProduct.id,
        code: TbProduct.code,
        description: TbProduct.description,
        unit: TbProduct.unit,
      })
      .from(TbProduct)
      .where(eq(TbProduct.orgId, c.session.orgId))
      .orderBy(TbProduct.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbProduct.id,
        code: TbProduct.code,
        description: TbProduct.description,
        unit: TbProduct.unit,
      })
      .from(TbProduct)
      .where(and(eq(TbProduct.id, id), eq(TbProduct.orgId, c.session.orgId)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function create(
    c: IContextUser,
    data: {
      code: string;
      description: string | null;
      unit: IUnitGroup;
    },
  ) {
    const [record] = await c.db
      .insert(TbProduct)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        code: data.code,
        description: data.description,
        unit: data.unit,
      })
      .returning({ id: TbProduct.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      code: string;
      description: string | null;
      unit: IUnitGroup;
    },
  ) {
    await c.db
      .update(TbProduct)
      .set({
        code: data.code,
        description: data.description,
        unit: data.unit,
      })
      .where(and(eq(TbProduct.id, id), eq(TbProduct.orgId, c.session.orgId)));
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbProduct)
      .where(and(eq(TbProduct.orgId, c.session.orgId), eq(TbProduct.id, id)));
  }
}
