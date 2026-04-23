import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbRiskSwotAnalysis } from "../orm/TbRiskSwotAnalysis";

export namespace ServiceRiskSwotAnalysis {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbRiskSwotAnalysis.id,
        type: TbRiskSwotAnalysis.type,
        description: TbRiskSwotAnalysis.description,
        solutions: TbRiskSwotAnalysis.solutions,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        analysisCreatedAt: TbRiskSwotAnalysis.analysisCreatedAt,
        estimatedCompletionDate: TbRiskSwotAnalysis.estimatedCompletionDate,
        completedAt: TbRiskSwotAnalysis.completedAt,
        isActionRequired: TbRiskSwotAnalysis.isActionRequired,
      })
      .from(TbRiskSwotAnalysis)
      .innerJoin(TbUser, eq(TbUser.id, TbRiskSwotAnalysis.responsibleUserId))
      .where(eq(TbRiskSwotAnalysis.orgId, c.session.orgId))
      .orderBy(TbRiskSwotAnalysis.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbRiskSwotAnalysis.id,
        type: TbRiskSwotAnalysis.type,
        description: TbRiskSwotAnalysis.description,
        solutions: TbRiskSwotAnalysis.solutions,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        analysisCreatedAt: TbRiskSwotAnalysis.analysisCreatedAt,
        estimatedCompletionDate: TbRiskSwotAnalysis.estimatedCompletionDate,
        completedAt: TbRiskSwotAnalysis.completedAt,
        isActionRequired: TbRiskSwotAnalysis.isActionRequired,
      })
      .from(TbRiskSwotAnalysis)
      .innerJoin(TbUser, eq(TbUser.id, TbRiskSwotAnalysis.responsibleUserId))
      .where(
        and(
          eq(TbRiskSwotAnalysis.id, id),
          eq(TbRiskSwotAnalysis.orgId, c.session.orgId),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function create(
    c: IContextUser,
    data: {
      type: string;
      description: string | null;
      solutions: string;
      responsibleUserId: string;
      analysisCreatedAt: string;
      estimatedCompletionDate: string;
      completedAt: string;
      isActionRequired: boolean;
    },
  ) {
    const [record] = await c.db
      .insert(TbRiskSwotAnalysis)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        type: data.type,
        description: data.description,
        solutions: data.solutions,
        responsibleUserId: data.responsibleUserId,
        analysisCreatedAt: data.analysisCreatedAt,
        estimatedCompletionDate: data.estimatedCompletionDate,
        completedAt: data.completedAt,
        isActionRequired: data.isActionRequired,
      })
      .returning({ id: TbRiskSwotAnalysis.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      type: string;
      description: string | null;
      solutions: string;
      responsibleUserId: string;
      analysisCreatedAt: string;
      estimatedCompletionDate: string;
      completedAt: string;
      isActionRequired: boolean;
    },
  ) {
    await c.db
      .update(TbRiskSwotAnalysis)
      .set({
        type: data.type,
        description: data.description,
        solutions: data.solutions,
        responsibleUserId: data.responsibleUserId,
        analysisCreatedAt: data.analysisCreatedAt,
        estimatedCompletionDate: data.estimatedCompletionDate,
        completedAt: data.completedAt,
        isActionRequired: data.isActionRequired,
      })
      .where(
        and(
          eq(TbRiskSwotAnalysis.id, id),
          eq(TbRiskSwotAnalysis.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbRiskSwotAnalysis)
      .where(
        and(
          eq(TbRiskSwotAnalysis.id, id),
          eq(TbRiskSwotAnalysis.orgId, c.session.orgId),
        ),
      );
  }
}
