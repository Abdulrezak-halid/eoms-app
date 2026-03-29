import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbDepartment } from "@m/base/orm/TbDepartment";
import { TbNeedAndExpectation } from "@m/commitment/orm/TbNeedAndExpectation";
import { TbNeedAndExpectationDepartments } from "@m/commitment/orm/TbNeedAndExpectationDepartment";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

export namespace ServiceNeedAndExpectation {
  export async function getAll(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbNeedAndExpectation.id,
        interestedParty: TbNeedAndExpectation.interestedParty,
        interestedPartyNeedsAndExpectations:
          TbNeedAndExpectation.interestedPartyNeedsAndExpectations,
        isIncludedInEnms: TbNeedAndExpectation.isIncludedInEnms,
        evaluationMethod: TbNeedAndExpectation.evaluationMethod,
        revisionDate: TbNeedAndExpectation.revisionDate,
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbNeedAndExpectation)
      .innerJoin(
        TbNeedAndExpectationDepartments,
        eq(TbNeedAndExpectationDepartments.subjectId, TbNeedAndExpectation.id),
      )
      .innerJoin(
        TbDepartment,
        eq(TbDepartment.id, TbNeedAndExpectationDepartments.departmentId),
      )
      .where(eq(TbNeedAndExpectation.orgId, c.session.orgId))
      .groupBy(TbNeedAndExpectation.id)
      .orderBy(TbNeedAndExpectation.createdAt);

    return { records };
  }

  export async function create(
    c: IContextUser,
    data: {
      interestedParty: string;
      interestedPartyNeedsAndExpectations: string;
      isIncludedInEnms: boolean;
      evaluationMethod: string;
      revisionDate: string;
      departmentIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbNeedAndExpectation)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          interestedParty: data.interestedParty,
          interestedPartyNeedsAndExpectations:
            data.interestedPartyNeedsAndExpectations,
          isIncludedInEnms: data.isIncludedInEnms,
          evaluationMethod: data.evaluationMethod,
          revisionDate: data.revisionDate,
        })
        .returning({ id: TbNeedAndExpectation.id });
      await tx.insert(TbNeedAndExpectationDepartments).values(
        data.departmentIds.map((id) => ({
          subjectId: record.id,
          departmentId: id,
        })),
      );
      return record.id;
    });
  }
  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbNeedAndExpectation.id,
        interestedParty: TbNeedAndExpectation.interestedParty,
        interestedPartyNeedsAndExpectations:
          TbNeedAndExpectation.interestedPartyNeedsAndExpectations,
        isIncludedInEnms: TbNeedAndExpectation.isIncludedInEnms,
        evaluationMethod: TbNeedAndExpectation.evaluationMethod,
        revisionDate: TbNeedAndExpectation.revisionDate,
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbNeedAndExpectation)
      .innerJoin(
        TbNeedAndExpectationDepartments,
        eq(TbNeedAndExpectationDepartments.subjectId, TbNeedAndExpectation.id),
      )
      .innerJoin(
        TbDepartment,
        eq(TbDepartment.id, TbNeedAndExpectationDepartments.departmentId),
      )
      .where(
        and(
          eq(TbNeedAndExpectation.orgId, c.session.orgId),
          eq(TbNeedAndExpectation.id, id),
        ),
      )

      .groupBy(TbNeedAndExpectation.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      interestedParty: string;
      interestedPartyNeedsAndExpectations: string;
      isIncludedInEnms: boolean;
      evaluationMethod: string;
      revisionDate: string;
      departmentIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbNeedAndExpectation)
        .set({
          interestedParty: data.interestedParty,
          interestedPartyNeedsAndExpectations:
            data.interestedPartyNeedsAndExpectations,
          isIncludedInEnms: data.isIncludedInEnms,
          evaluationMethod: data.evaluationMethod,
          revisionDate: data.revisionDate,
        })
        .where(
          and(
            eq(TbNeedAndExpectation.id, id),
            eq(TbNeedAndExpectation.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbNeedAndExpectation.id });

      if (!record) {
        throw new ApiException(EApiFailCode.BAD_REQUEST);
      }

      await tx
        .delete(TbNeedAndExpectationDepartments)
        .where(eq(TbNeedAndExpectationDepartments.subjectId, id));

      if (data.departmentIds.length > 0) {
        await tx.insert(TbNeedAndExpectationDepartments).values(
          data.departmentIds.map((departmentId) => ({
            subjectId: record.id,
            departmentId: departmentId,
          })),
        );
      }
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbNeedAndExpectationDepartments)
        .where(eq(TbNeedAndExpectationDepartments.subjectId, id));

      const rec = await tx
        .delete(TbNeedAndExpectation)
        .where(
          and(
            eq(TbNeedAndExpectation.orgId, c.session.orgId),
            eq(TbNeedAndExpectation.id, id),
          ),
        );

      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
    });
  }
}
