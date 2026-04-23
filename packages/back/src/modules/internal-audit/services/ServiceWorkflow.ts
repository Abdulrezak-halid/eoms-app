import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbNonconformity } from "../orm/TbNonconformity";
import { TbWorkflow } from "../orm/TbWorkflow";
import { TbWorkflowNonconformity } from "../orm/TbWorkflowNonconformity";

export namespace ServiceWorkflow {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbWorkflow.id,
        part: TbWorkflow.part,
        highLevelSubject: TbWorkflow.highLevelSubject,
        subject: TbWorkflow.subject,
        reviewerUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        questions: TbWorkflow.questions,
        necessaries: TbWorkflow.necessaries,
        necessaryProof: TbWorkflow.necessaryProof,
        obtainedProof: TbWorkflow.obtainedProof,
        correctiveActionDecisions: TbWorkflow.correctiveActionDecisions,
        comments: TbWorkflow.comments,
        nonconformities: UtilDb.jsonAgg({
          id: TbNonconformity.id,
          displayName: TbNonconformity.definition,
        }),
      })
      .from(TbWorkflow)
      .innerJoin(TbUser, eq(TbUser.id, TbWorkflow.reviewerUserId))
      .innerJoin(
        TbWorkflowNonconformity,
        eq(TbWorkflowNonconformity.subjectId, TbWorkflow.id),
      )
      .innerJoin(
        TbNonconformity,
        eq(TbNonconformity.id, TbWorkflowNonconformity.nonconformityId),
      )
      .where(eq(TbWorkflow.orgId, c.session.orgId))
      .groupBy(TbWorkflow.id, TbUser.id, sqlUserDisplayName())
      .orderBy(TbWorkflow.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbWorkflow.id,
        part: TbWorkflow.part,
        highLevelSubject: TbWorkflow.highLevelSubject,
        subject: TbWorkflow.subject,
        reviewerUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        questions: TbWorkflow.questions,
        necessaries: TbWorkflow.necessaries,
        necessaryProof: TbWorkflow.necessaryProof,
        obtainedProof: TbWorkflow.obtainedProof,
        correctiveActionDecisions: TbWorkflow.correctiveActionDecisions,
        comments: TbWorkflow.comments,
        nonconformities: UtilDb.jsonAgg({
          id: TbNonconformity.id,
          displayName: TbNonconformity.definition,
        }),
      })
      .from(TbWorkflow)
      .innerJoin(TbUser, eq(TbUser.id, TbWorkflow.reviewerUserId))
      .innerJoin(
        TbWorkflowNonconformity,
        eq(TbWorkflowNonconformity.subjectId, TbWorkflow.id),
      )
      .innerJoin(
        TbNonconformity,
        eq(TbNonconformity.id, TbWorkflowNonconformity.nonconformityId),
      )
      .where(and(eq(TbWorkflow.orgId, c.session.orgId), eq(TbWorkflow.id, id)))
      .groupBy(TbWorkflow.id, TbUser.id, sqlUserDisplayName());

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      part: string;
      highLevelSubject: string;
      subject: string;
      reviewerUserId: string;
      questions: string;
      necessaries: string;
      necessaryProof: string;
      obtainedProof: string;
      correctiveActionDecisions: string;
      comments: string;
      nonconformityIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbWorkflow)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          part: data.part,
          highLevelSubject: data.highLevelSubject,
          subject: data.subject,
          reviewerUserId: data.reviewerUserId,
          questions: data.questions,
          necessaries: data.necessaries,
          necessaryProof: data.necessaryProof,
          obtainedProof: data.obtainedProof,
          correctiveActionDecisions: data.correctiveActionDecisions,
          comments: data.comments,
        })
        .returning({ id: TbWorkflow.id });
      if (data.nonconformityIds.length > 0) {
        await tx.insert(TbWorkflowNonconformity).values(
          data.nonconformityIds.map((id) => ({
            subjectId: record.id,
            nonconformityId: id,
          })),
        );
      }
      return record.id;
    });
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      part: string;
      highLevelSubject: string;
      subject: string;
      reviewerUserId: string;
      questions: string;
      necessaries: string;
      necessaryProof: string;
      obtainedProof: string;
      correctiveActionDecisions: string;
      comments: string;
      nonconformityIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbWorkflow)
        .set({
          part: data.part,
          highLevelSubject: data.highLevelSubject,
          subject: data.subject,
          reviewerUserId: data.reviewerUserId,
          questions: data.questions,
          necessaries: data.necessaries,
          necessaryProof: data.necessaryProof,
          obtainedProof: data.obtainedProof,
          correctiveActionDecisions: data.correctiveActionDecisions,
          comments: data.comments,
        })
        .where(
          and(eq(TbWorkflow.orgId, c.session.orgId), eq(TbWorkflow.id, id)),
        )
        .returning({ id: TbWorkflow.id });
      if (!record) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
      await tx
        .delete(TbWorkflowNonconformity)
        .where(eq(TbWorkflowNonconformity.subjectId, id));
      if (data.nonconformityIds.length > 0) {
        await tx.insert(TbWorkflowNonconformity).values(
          data.nonconformityIds.map((nonconformityId) => ({
            subjectId: record.id,
            nonconformityId: nonconformityId,
          })),
        );
      }
    });
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbWorkflowNonconformity)
        .where(and(eq(TbWorkflowNonconformity.subjectId, id)));

      const rec = await tx
        .delete(TbWorkflow)
        .where(
          and(eq(TbWorkflow.orgId, c.session.orgId), eq(TbWorkflow.id, id)),
        );
      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Workflow record not found or already deleted.",
        );
      }
    });
  }
}
