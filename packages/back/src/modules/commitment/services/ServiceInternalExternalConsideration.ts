import { EApiFailCode } from "common";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { IDepartmentShort } from "@m/base/interfaces/IDepartmentShort";
import { TbDepartment } from "@m/base/orm/TbDepartment";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbInternalExternalConsideration } from "../orm/TbInternalExternalConsideration";
import { TbInternalExternalConsiderationDepartment } from "../orm/TbInternalExternalConsiderationDepartment";

export namespace ServiceInternalExternalConsideration {
  export async function getAll(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbInternalExternalConsideration.id,
        specific: TbInternalExternalConsideration.specific,
        impactPoint: TbInternalExternalConsideration.impactPoint,
        evaluationMethod: TbInternalExternalConsideration.evaluationMethod,
        revisionDate: TbInternalExternalConsideration.revisionDate,
        updatedAt: UtilDb.isoDatetime(
          TbInternalExternalConsideration.updatedAt,
        ),
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbInternalExternalConsideration)
      .innerJoin(
        TbInternalExternalConsiderationDepartment,
        eq(
          TbInternalExternalConsiderationDepartment.subjectId,
          TbInternalExternalConsideration.id,
        ),
      )
      .innerJoin(
        TbDepartment,
        eq(
          TbDepartment.id,
          TbInternalExternalConsiderationDepartment.departmentId,
        ),
      )
      .where(
        and(
          eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          isNull(TbInternalExternalConsideration.parentId),
        ),
      )
      .groupBy(TbInternalExternalConsideration.id)
      .orderBy(TbInternalExternalConsideration.createdAt);

    return { records };
  }

  export async function getHistory(c: IContextUser, id: string) {
    const records = await c.db
      .select({
        id: TbInternalExternalConsideration.id,
        specific: TbInternalExternalConsideration.specific,
        impactPoint: TbInternalExternalConsideration.impactPoint,
        evaluationMethod: TbInternalExternalConsideration.evaluationMethod,
        revisionDate: TbInternalExternalConsideration.revisionDate,
        updatedAt: UtilDb.isoDatetime(
          TbInternalExternalConsideration.updatedAt,
        ),
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbInternalExternalConsideration)
      .innerJoin(
        TbInternalExternalConsiderationDepartment,
        eq(
          TbInternalExternalConsiderationDepartment.subjectId,
          TbInternalExternalConsideration.id,
        ),
      )
      .innerJoin(
        TbDepartment,
        eq(
          TbDepartment.id,
          TbInternalExternalConsiderationDepartment.departmentId,
        ),
      )
      .where(
        and(
          eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          eq(TbInternalExternalConsideration.parentId, id),
        ),
      )
      .groupBy(TbInternalExternalConsideration.id)
      .orderBy(desc(TbInternalExternalConsideration.createdAt));

    return { records };
  }

  export async function create(
    c: IContextUser,
    data: {
      specific: string;
      impactPoint: string;
      evaluationMethod: string;
      revisionDate: string;
      departmentIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbInternalExternalConsideration)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          updatedAt: c.nowDatetime,
          specific: data.specific,
          impactPoint: data.impactPoint,
          evaluationMethod: data.evaluationMethod,
          revisionDate: data.revisionDate,
        })
        .returning({ id: TbInternalExternalConsideration.id });
      await tx.insert(TbInternalExternalConsiderationDepartment).values(
        data.departmentIds.map((id) => ({
          subjectId: record.id,
          departmentId: id,
        })),
      );
      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      specific: string;
      impactPoint: string;
      evaluationMethod: string;
      revisionDate: string;
      departmentIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(TbInternalExternalConsideration)
        .where(
          and(
            eq(TbInternalExternalConsideration.id, id),
            isNull(TbInternalExternalConsideration.parentId),
            eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          ),
        );

      if (!existing) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }

      const copyData = {
        ...existing,
        id: undefined,
        createdAt: c.nowDatetime,
        updatedAt: c.nowDatetime,
        parentId: id,
      };
      delete copyData.id;

      const [copy] = await tx
        .insert(TbInternalExternalConsideration)
        .values(copyData)
        .returning({ id: TbInternalExternalConsideration.id });

      const departments = await tx
        .select({
          departmentId: TbInternalExternalConsiderationDepartment.departmentId,
        })
        .from(TbInternalExternalConsiderationDepartment)
        .where(eq(TbInternalExternalConsiderationDepartment.subjectId, id));

      if (departments.length > 0) {
        await tx.insert(TbInternalExternalConsiderationDepartment).values(
          departments.map((d) => ({
            subjectId: copy.id,
            departmentId: d.departmentId,
          })),
        );
      }

      const [record] = await tx
        .update(TbInternalExternalConsideration)
        .set({
          specific: data.specific,
          impactPoint: data.impactPoint,
          evaluationMethod: data.evaluationMethod,
          revisionDate: data.revisionDate,
        })
        .where(
          and(
            eq(TbInternalExternalConsideration.id, id),
            eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbInternalExternalConsideration.id });

      if (!record) {
        throw new ApiException(EApiFailCode.BAD_REQUEST);
      }

      await tx
        .delete(TbInternalExternalConsiderationDepartment)
        .where(eq(TbInternalExternalConsiderationDepartment.subjectId, id));

      if (data.departmentIds.length > 0) {
        await tx.insert(TbInternalExternalConsiderationDepartment).values(
          data.departmentIds.map((departmentId) => ({
            subjectId: record.id,
            departmentId: departmentId,
          })),
        );
      }
    });
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbInternalExternalConsideration.id,
        specific: TbInternalExternalConsideration.specific,
        impactPoint: TbInternalExternalConsideration.impactPoint,
        evaluationMethod: TbInternalExternalConsideration.evaluationMethod,
        revisionDate: TbInternalExternalConsideration.revisionDate,
        updatedAt: UtilDb.isoDatetime(
          TbInternalExternalConsideration.updatedAt,
        ),
        departments: sql<
          IDepartmentShort[]
        >`json_agg(json_build_object('id', ${TbDepartment.id}, 'name', ${TbDepartment.name}))`,
      })
      .from(TbInternalExternalConsideration)
      .innerJoin(
        TbInternalExternalConsiderationDepartment,
        eq(
          TbInternalExternalConsiderationDepartment.subjectId,
          TbInternalExternalConsideration.id,
        ),
      )
      .innerJoin(
        TbDepartment,
        eq(
          TbDepartment.id,
          TbInternalExternalConsiderationDepartment.departmentId,
        ),
      )
      .where(
        and(
          eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          eq(TbInternalExternalConsideration.id, id),
        ),
      )
      .groupBy(TbInternalExternalConsideration.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      const childIds = await tx
        .select({ id: TbInternalExternalConsideration.id })
        .from(TbInternalExternalConsideration)
        .where(
          and(
            eq(TbInternalExternalConsideration.parentId, id),
            eq(TbInternalExternalConsideration.orgId, c.session.orgId),
          ),
        );

      if (childIds.length > 0) {
        await tx.delete(TbInternalExternalConsiderationDepartment).where(
          inArray(
            TbInternalExternalConsiderationDepartment.subjectId,
            childIds.map((ch) => ch.id),
          ),
        );

        await tx
          .delete(TbInternalExternalConsideration)
          .where(eq(TbInternalExternalConsideration.parentId, id));
      }

      await tx
        .delete(TbInternalExternalConsiderationDepartment)
        .where(eq(TbInternalExternalConsiderationDepartment.subjectId, id));

      const rec = await tx
        .delete(TbInternalExternalConsideration)
        .where(
          and(
            eq(TbInternalExternalConsideration.orgId, c.session.orgId),
            isNull(TbInternalExternalConsideration.parentId),
            eq(TbInternalExternalConsideration.id, id),
          ),
        );

      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Internal/External Consideration not found or already deleted.",
        );
      }
    });
  }
}
