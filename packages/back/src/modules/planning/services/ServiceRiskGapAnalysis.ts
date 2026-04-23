import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbRiskGapAnalysis } from "../orm/TbRiskGapAnalysis";

export namespace ServiceRiskGapAnalysis {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbRiskGapAnalysis.id,
        question: TbRiskGapAnalysis.question,
        headings: TbRiskGapAnalysis.headings,
        score: TbRiskGapAnalysis.score,
        evidence: TbRiskGapAnalysis.evidence,
        consideration: TbRiskGapAnalysis.consideration,
        isActionRequired: TbRiskGapAnalysis.isActionRequired,
      })
      .from(TbRiskGapAnalysis)
      .where(eq(TbRiskGapAnalysis.orgId, c.session.orgId))
      .orderBy(TbRiskGapAnalysis.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbRiskGapAnalysis.id,
        question: TbRiskGapAnalysis.question,
        headings: TbRiskGapAnalysis.headings,
        score: TbRiskGapAnalysis.score,
        evidence: TbRiskGapAnalysis.evidence,
        consideration: TbRiskGapAnalysis.consideration,
        isActionRequired: TbRiskGapAnalysis.isActionRequired,
      })
      .from(TbRiskGapAnalysis)
      .where(
        and(
          eq(TbRiskGapAnalysis.id, id),
          eq(TbRiskGapAnalysis.orgId, c.session.orgId),
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
      question: string;
      headings: string;
      score: number;
      evidence: string;
      consideration: string;
      isActionRequired: boolean;
    },
  ) {
    const [record] = await c.db
      .insert(TbRiskGapAnalysis)
      .values({
        orgId: c.session.orgId,
        question: data.question,
        headings: data.headings,
        score: data.score,
        evidence: data.evidence,
        consideration: data.consideration,
        isActionRequired: data.isActionRequired,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
      })
      .returning({ id: TbRiskGapAnalysis.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      question: string;
      headings: string;
      score: number;
      evidence: string;
      consideration: string;
      isActionRequired: boolean;
    },
  ) {
    await c.db
      .update(TbRiskGapAnalysis)
      .set({
        question: data.question,
        headings: data.headings,
        score: data.score,
        evidence: data.evidence,
        consideration: data.consideration,
        isActionRequired: data.isActionRequired,
      })
      .where(
        and(
          eq(TbRiskGapAnalysis.id, id),
          eq(TbRiskGapAnalysis.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbRiskGapAnalysis)
      .where(
        and(
          eq(TbRiskGapAnalysis.id, id),
          eq(TbRiskGapAnalysis.orgId, c.session.orgId),
        ),
      );
  }
}
