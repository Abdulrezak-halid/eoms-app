import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbRiskForceFieldAnalysis } from "@m/planning/orm/TbRiskForceFieldAnalysis";

export namespace ServiceRiskForceFieldAnalysis {
  export function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbRiskForceFieldAnalysis.id,
        parameter: TbRiskForceFieldAnalysis.parameter,
        score: TbRiskForceFieldAnalysis.score,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        solutions: TbRiskForceFieldAnalysis.solutions,
        completedAt: TbRiskForceFieldAnalysis.completedAt,
        estimatedCompletionDate:
          TbRiskForceFieldAnalysis.estimatedCompletionDate,
        isSucceed: TbRiskForceFieldAnalysis.isSucceed,
        isFollowUpRequired: TbRiskForceFieldAnalysis.isFollowUpRequired,
        isActionRequired: TbRiskForceFieldAnalysis.isActionRequired,
      })
      .from(TbRiskForceFieldAnalysis)
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbRiskForceFieldAnalysis.responsibleUserId),
      )
      .where(eq(TbRiskForceFieldAnalysis.orgId, c.session.orgId))
      .orderBy(TbRiskForceFieldAnalysis.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      parameter: string;
      score: number;
      responsibleUserId: string;
      solutions: string;
      completedAt: string;
      estimatedCompletionDate: string;
      isSucceed: boolean;
      isFollowUpRequired: boolean;
      isActionRequired: boolean;
    },
  ) {
    const [record] = await c.db
      .insert(TbRiskForceFieldAnalysis)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        parameter: data.parameter,
        score: data.score,
        responsibleUserId: data.responsibleUserId,
        solutions: data.solutions,
        completedAt: data.completedAt,
        estimatedCompletionDate: data.estimatedCompletionDate,
        isSucceed: data.isSucceed,
        isFollowUpRequired: data.isFollowUpRequired,
        isActionRequired: data.isActionRequired,
      })
      .returning({ id: TbRiskForceFieldAnalysis.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      parameter: string;
      score: number;
      responsibleUserId: string;
      solutions: string;
      completedAt: string;
      estimatedCompletionDate: string;
      isSucceed: boolean;
      isFollowUpRequired: boolean;
      isActionRequired: boolean;
    },
  ) {
    await c.db
      .update(TbRiskForceFieldAnalysis)
      .set({
        parameter: data.parameter,
        score: data.score,
        responsibleUserId: data.responsibleUserId,
        solutions: data.solutions,
        completedAt: data.completedAt,
        estimatedCompletionDate: data.estimatedCompletionDate,
        isSucceed: data.isSucceed,
        isFollowUpRequired: data.isFollowUpRequired,
        isActionRequired: data.isActionRequired,
      })
      .where(
        and(
          eq(TbRiskForceFieldAnalysis.id, id),
          eq(TbRiskForceFieldAnalysis.orgId, c.session.orgId),
        ),
      );
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbRiskForceFieldAnalysis.id,
        parameter: TbRiskForceFieldAnalysis.parameter,
        score: TbRiskForceFieldAnalysis.score,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        solutions: TbRiskForceFieldAnalysis.solutions,
        completedAt: TbRiskForceFieldAnalysis.completedAt,
        estimatedCompletionDate:
          TbRiskForceFieldAnalysis.estimatedCompletionDate,
        isSucceed: TbRiskForceFieldAnalysis.isSucceed,
        isFollowUpRequired: TbRiskForceFieldAnalysis.isFollowUpRequired,
        isActionRequired: TbRiskForceFieldAnalysis.isActionRequired,
      })
      .from(TbRiskForceFieldAnalysis)
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbRiskForceFieldAnalysis.responsibleUserId),
      )
      .where(
        and(
          eq(TbRiskForceFieldAnalysis.orgId, c.session.orgId),
          eq(TbRiskForceFieldAnalysis.id, id),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbRiskForceFieldAnalysis)
      .where(
        and(
          eq(TbRiskForceFieldAnalysis.orgId, c.session.orgId),
          eq(TbRiskForceFieldAnalysis.id, id),
        ),
      );
  }
}
