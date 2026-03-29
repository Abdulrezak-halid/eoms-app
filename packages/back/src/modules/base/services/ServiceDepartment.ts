import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextUser } from "@m/core/interfaces/IContext";

import { TbDepartment } from "../orm/TbDepartment";

export namespace ServiceDepartment {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbDepartment);
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbDepartment.id,
        name: TbDepartment.name,
        description: TbDepartment.description,
      })
      .from(TbDepartment)
      .where(eq(TbDepartment.orgId, c.session.orgId))
      .orderBy(TbDepartment.createdAt);
  }

  export async function getNames(c: IContextUser) {
    return await c.db
      .select({
        id: TbDepartment.id,
        name: TbDepartment.name,
      })
      .from(TbDepartment)
      .where(eq(TbDepartment.orgId, c.session.orgId));
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      description: string | null;
    },
  ) {
    const [record] = await c.db
      .insert(TbDepartment)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        name: data.name,
        description: data.description,
      })
      .returning({ id: TbDepartment.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      description: string | null;
    },
  ) {
    await c.db
      .update(TbDepartment)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(
        and(eq(TbDepartment.id, id), eq(TbDepartment.orgId, c.session.orgId)),
      );
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbDepartment.id,
        name: TbDepartment.name,
        description: TbDepartment.description,
      })
      .from(TbDepartment)
      .where(
        and(eq(TbDepartment.orgId, c.session.orgId), eq(TbDepartment.id, id)),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbDepartment)
      .where(
        and(eq(TbDepartment.orgId, c.session.orgId), eq(TbDepartment.id, id)),
      );
  }
}
