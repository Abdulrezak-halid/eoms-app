import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { IPeriod } from "../interfaces/IPeriod";
import { TbComplianceObligationArticle } from "../orm/TbComplianceObligationArticle";

export namespace ServiceComplianceObligationArticle {
  export async function getAll(c: IContextUser, subjectId: string) {
    return await c.db
      .select({
        id: TbComplianceObligationArticle.id,
        relatedArticleNo: TbComplianceObligationArticle.relatedArticleNo,
        currentApplication: TbComplianceObligationArticle.currentApplication,
        conformityAssessment:
          TbComplianceObligationArticle.conformityAssessment,
        description: TbComplianceObligationArticle.description,
        conformityAssessmentPeriod:
          TbComplianceObligationArticle.conformityAssessmentPeriod,
        lastConformityAssessment:
          TbComplianceObligationArticle.lastConformityAssessment,
      })
      .from(TbComplianceObligationArticle)
      .where(
        and(
          eq(TbComplianceObligationArticle.orgId, c.session.orgId),
          eq(TbComplianceObligationArticle.subjectId, subjectId),
        ),
      )
      .orderBy(TbComplianceObligationArticle.createdAt);
  }
  export async function get(c: IContextUser, subjectId: string, id: string) {
    const [record] = await c.db
      .select({
        id: TbComplianceObligationArticle.id,
        relatedArticleNo: TbComplianceObligationArticle.relatedArticleNo,
        currentApplication: TbComplianceObligationArticle.currentApplication,
        conformityAssessment:
          TbComplianceObligationArticle.conformityAssessment,
        conformityAssessmentPeriod:
          TbComplianceObligationArticle.conformityAssessmentPeriod,
        lastConformityAssessment:
          TbComplianceObligationArticle.lastConformityAssessment,
        description: TbComplianceObligationArticle.description,
      })
      .from(TbComplianceObligationArticle)
      .where(
        and(
          eq(TbComplianceObligationArticle.orgId, c.session.orgId),
          eq(TbComplianceObligationArticle.subjectId, subjectId),
          eq(TbComplianceObligationArticle.id, id),
        ),
      );
    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }
  export async function create(
    c: IContextUser,
    subjectId: string,
    data: {
      relatedArticleNo: string;
      currentApplication: string;
      conformityAssessment: string;
      conformityAssessmentPeriod: IPeriod;
      lastConformityAssessment: string;
      description: string | null;
    },
  ) {
    const [record] = await c.db
      .insert(TbComplianceObligationArticle)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        subjectId: subjectId,
        relatedArticleNo: data.relatedArticleNo,
        currentApplication: data.currentApplication,
        conformityAssessment: data.conformityAssessment,
        lastConformityAssessment: data.lastConformityAssessment,
        description: data.description,
        conformityAssessmentPeriod: data.conformityAssessmentPeriod,
      })
      .returning({
        id: TbComplianceObligationArticle.id,
      });

    return record.id;
  }
  export async function update(
    c: IContextUser,
    subjectId: string,
    id: string,
    data: {
      relatedArticleNo: string;
      currentApplication: string;
      conformityAssessment: string;
      description: string | null;
      conformityAssessmentPeriod: IPeriod;
      lastConformityAssessment: string;
    },
  ) {
    await c.db
      .update(TbComplianceObligationArticle)
      .set({
        orgId: c.session.orgId,
        relatedArticleNo: data.relatedArticleNo,
        currentApplication: data.currentApplication,
        conformityAssessment: data.conformityAssessment,
        lastConformityAssessment: data.lastConformityAssessment,
        description: data.description,
        conformityAssessmentPeriod: data.conformityAssessmentPeriod,
      })
      .where(
        and(
          eq(TbComplianceObligationArticle.orgId, c.session.orgId),
          eq(TbComplianceObligationArticle.subjectId, subjectId),
          eq(TbComplianceObligationArticle.id, id),
        ),
      );
  }
  export async function remove(c: IContextUser, subjectId: string, id: string) {
    await c.db
      .delete(TbComplianceObligationArticle)
      .where(
        and(
          eq(TbComplianceObligationArticle.orgId, c.session.orgId),
          eq(TbComplianceObligationArticle.subjectId, subjectId),
          eq(TbComplianceObligationArticle.id, id),
        ),
      );
  }
}
