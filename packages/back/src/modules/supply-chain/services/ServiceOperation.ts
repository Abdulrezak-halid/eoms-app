import { EApiFailCode } from "common";
import { SQL, and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbOperation } from "../orm/TbOperation";
import { TbPipeline } from "../orm/TbPipeline";

export namespace ServiceOperation {
  export async function getAll(c: IContextUser, pipelineId?: string) {
    const filters: SQL[] = [eq(TbOperation.orgId, c.orgId)];

    if (pipelineId) {
      filters.push(eq(TbOperation.pipelineId, pipelineId));
    }

    return await c.db
      .select({
        id: TbOperation.id,
        createdAt: UtilDb.isoDatetime(TbOperation.createdAt),
        name: TbOperation.name,
        pipeline: {
          id: TbPipeline.id,
          name: TbPipeline.name,
        },
        index: TbOperation.index,
      })
      .from(TbOperation)
      .innerJoin(
        TbPipeline,
        and(
          eq(TbPipeline.orgId, c.orgId),
          eq(TbPipeline.id, TbOperation.pipelineId),
        ),
      )
      .where(and(...filters))
      .orderBy(TbOperation.pipelineId, TbOperation.index);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbOperation.id,
        createdAt: UtilDb.isoDatetime(TbOperation.createdAt),
        name: TbOperation.name,
        pipeline: {
          id: TbPipeline.id,
          name: TbPipeline.name,
        },
      })
      .from(TbOperation)
      .innerJoin(
        TbPipeline,
        and(
          eq(TbPipeline.orgId, c.orgId),
          eq(TbPipeline.id, TbOperation.pipelineId),
        ),
      )
      .where(and(eq(TbOperation.orgId, c.orgId), eq(TbOperation.id, id)))
      .limit(1);

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND, "Operation is not found.");
    }

    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      pipelineId: string;
      index: number;
    },
  ) {
    return await c.db.transaction(async (tx) => {
      await UtilDb.reorderRecords({ ...c, db: tx }, TbOperation, {
        columnField: "pipelineId",
        columnValue: data.pipelineId,

        index: data.index,
      });
      const [rec] = await tx
        .insert(TbOperation)
        .values({
          orgId: c.orgId,
          createdAt: c.nowDatetime,
          createdBy: c.session.userId,
          name: data.name,
          pipelineId: data.pipelineId,
          index: data.index,
        })
        .returning({ id: TbOperation.id });

      return rec;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      pipelineId: string;
      index: number;
    },
  ) {
    await c.db.transaction(async (tx) => {
      await UtilDb.reorderRecords({ ...c, db: tx }, TbOperation, {
        columnField: "pipelineId",
        columnValue: data.pipelineId,
        index: data.index,
        updatedId: id,
      });
      await tx
        .update(TbOperation)
        .set({
          name: data.name,
        })
        .where(and(eq(TbOperation.orgId, c.orgId), eq(TbOperation.id, id)));
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbOperation)
      .where(and(eq(TbOperation.orgId, c.orgId), eq(TbOperation.id, id)));
  }
}
