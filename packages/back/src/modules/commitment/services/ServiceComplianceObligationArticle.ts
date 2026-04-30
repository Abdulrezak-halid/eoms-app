import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { IPeriod } from "../interfaces/IPeriod";
import { TbComplianceObligationeomscle } from "../orm/TbComplianceObligationeomscle";

export namespace ServiceComplianceObligationeomscle {
  export async function getAll(c: IContextUser, subjectId: string) {
    return await c.db
      .select({
        id: TbComplianceObligationeomscle.id,
        relatedeomscleNo: TbComplianceObligationeomscle.relatedeomscleNo,
        currentApplication: TbComplianceObligationeomscle.currentApplication,
        conformityAssessment:
          TbComplianceObligationeomscle.conformityAssessment,
        description: TbComplianceObligationeomscle.description,
        conformityAssessmentPeriod:
          TbComplianceObligationeomscle.conformityAssessmentPeriod,
        lastConformityAssessment:
          TbComplianceObligationeomscle.lastConformityAssessment,
      })
      .from(TbComplianceObligationeomscle)
      .where(
        and(
          eq(TbComplianceObligationeomscle.orgId, c.session.orgId),
          eq(TbComplianceObligationeomscle.subjectId, subjectId),
        ),
      )
      .orderBy(TbComplianceObligationeomscle.createdAt);
  }
  export async function get(c: IContextUser, subjectId: string, id: string) {
    const [record] = await c.db
      .select({
        id: TbComplianceObligationeomscle.id,
        relatedeomscleNo: TbComplianceObligationeomscle.relatedeomscleNo,
        currentApplication: TbComplianceObligationeomscle.currentApplication,
        conformityAssessment:
          TbComplianceObligationeomscle.conformityAssessment,
        conformityAssessmentPeriod:
          TbComplianceObligationeomscle.conformityAssessmentPeriod,
        lastConformityAssessment:
          TbComplianceObligationeomscle.lastConformityAssessment,
        description: TbComplianceObligationeomscle.description,
      })
      .from(TbComplianceObligationeomscle)
      .where(
        and(
          eq(TbComplianceObligationeomscle.orgId, c.session.orgId),
          eq(TbComplianceObligationeomscle.subjectId, subjectId),
          eq(TbComplianceObligationeomscle.id, id),
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
      relatedeomscleNo: string;
      currentApplication: string;
      conformityAssessment: string;
      conformityAssessmentPeriod: IPeriod;
      lastConformityAssessment: string;
      description: string | null;
    },
  ) {
    const [record] = await c.db
      .insert(TbComplianceObligationeomscle)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        subjectId: subjectId,
        relatedeomscleNo: data.relatedeomscleNo,
        currentApplication: data.currentApplication,
        conformityAssessment: data.conformityAssessment,
        lastConformityAssessment: data.lastConformityAssessment,
        description: data.description,
        conformityAssessmentPeriod: data.conformityAssessmentPeriod,
      })
      .returning({
        id: TbComplianceObligationeomscle.id,
      });

    return record.id;
  }
  export async function update(
    c: IContextUser,
    subjectId: string,
    id: string,
    data: {
      relatedeomscleNo: string;
      currentApplication: string;
      conformityAssessment: string;
      description: string | null;
      conformityAssessmentPeriod: IPeriod;
      lastConformityAssessment: string;
    },
  ) {
    await c.db
      .update(TbComplianceObligationeomscle)
      .set({
        orgId: c.session.orgId,
        relatedeomscleNo: data.relatedeomscleNo,
        currentApplication: data.currentApplication,
        conformityAssessment: data.conformityAssessment,
        lastConformityAssessment: data.lastConformityAssessment,
        description: data.description,
        conformityAssessmentPeriod: data.conformityAssessmentPeriod,
      })
      .where(
        and(
          eq(TbComplianceObligationeomscle.orgId, c.session.orgId),
          eq(TbComplianceObligationeomscle.subjectId, subjectId),
          eq(TbComplianceObligationeomscle.id, id),
        ),
      );
  }
  export async function remove(c: IContextUser, subjectId: string, id: string) {
    await c.db
      .delete(TbComplianceObligationeomscle)
      .where(
        and(
          eq(TbComplianceObligationeomscle.orgId, c.session.orgId),
          eq(TbComplianceObligationeomscle.subjectId, subjectId),
          eq(TbComplianceObligationeomscle.id, id),
        ),
      );
  }
}
