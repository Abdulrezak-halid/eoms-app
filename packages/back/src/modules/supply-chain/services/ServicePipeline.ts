import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbOperation } from "../orm/TbOperation";
import { TbPipeline } from "../orm/TbPipeline";

export namespace ServicePipeline {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbPipeline);
  }

  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbPipeline.id,
        name: TbPipeline.name,
        createdAt: UtilDb.isoDatetime(TbPipeline.createdAt),
      })
      .from(TbPipeline)
      .where(eq(TbPipeline.orgId, c.orgId))
      .orderBy(TbPipeline.name);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbPipeline.id,
        name: TbPipeline.name,
        createdAt: UtilDb.isoDatetime(TbPipeline.createdAt),
      })
      .from(TbPipeline)
      .where(and(eq(TbPipeline.orgId, c.orgId), eq(TbPipeline.id, id)))
      .limit(1);

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function create(c: IContextUser, name: string) {
    const [rec] = await c.db
      .insert(TbPipeline)
      .values({
        orgId: c.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        name,
      })
      .returning({ id: TbPipeline.id });

    return rec;
  }

  export async function update(c: IContextUser, id: string, name: string) {
    await c.db
      .update(TbPipeline)
      .set({
        name,
      })
      .where(and(eq(TbPipeline.orgId, c.orgId), eq(TbPipeline.id, id)));
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbOperation)
        .where(
          and(eq(TbOperation.pipelineId, id), eq(TbOperation.orgId, c.orgId)),
        );

      await tx
        .delete(TbPipeline)
        .where(and(eq(TbPipeline.orgId, c.orgId), eq(TbPipeline.id, id)));
    });
  }
}
