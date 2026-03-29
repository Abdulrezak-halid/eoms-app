import { EApiFailCode } from "common";
import { and, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbNonconformity } from "@m/internal-audit/orm/TbNonconformity";

export namespace ServiceNonconformity {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbNonconformity);
  }

  export async function getAll(c: IContextUser) {
    const aliasUserResponsible = alias(TbUser, "rs");
    const aliasUserReviewer = alias(TbUser, "rv");
    return c.db
      .select({
        id: TbNonconformity.id,
        definition: TbNonconformity.definition,
        no: TbNonconformity.no,
        identifiedAt: TbNonconformity.identifiedAt,
        requirement: TbNonconformity.requirement,
        source: TbNonconformity.source,
        potentialResult: TbNonconformity.potentialResult,
        rootCause: TbNonconformity.rootCause,
        action: TbNonconformity.action,
        targetIdentificationDate: TbNonconformity.targetIdentificationDate,
        actualIdentificationDate: TbNonconformity.actualIdentificationDate,
        isCorrectiveActionOpen: TbNonconformity.isCorrectiveActionOpen,
        reviewerFeedback: TbNonconformity.reviewerFeedback,
        reviewerUser: {
          id: aliasUserReviewer.id,
          displayName: sqlUserDisplayName(aliasUserReviewer),
        },
        responsibleUser: {
          id: aliasUserResponsible.id,
          displayName: sqlUserDisplayName(aliasUserResponsible),
        },
      })
      .from(TbNonconformity)
      .innerJoin(
        aliasUserResponsible,
        eq(aliasUserResponsible.id, TbNonconformity.responsibleUserId),
      )
      .innerJoin(
        aliasUserReviewer,
        eq(aliasUserReviewer.id, TbNonconformity.reviewerUserId),
      )
      .where(eq(TbNonconformity.orgId, c.session.orgId))
      .orderBy(TbNonconformity.createdAt);
  }
  export async function getNames(c: IContextUser) {
    return c.db
      .select({
        id: TbNonconformity.id,
        displayName: TbNonconformity.definition,
      })
      .from(TbNonconformity)
      .where(eq(TbNonconformity.orgId, c.session.orgId));
  }

  export async function create(
    c: IContextUser,
    data: {
      definition: string;
      no: number;
      identifiedAt: string;
      requirement: string;
      source: string;
      potentialResult: string;
      rootCause: string;
      action: string;
      targetIdentificationDate: string;
      actualIdentificationDate: string;
      isCorrectiveActionOpen: boolean;
      reviewerFeedback: string;
      reviewerUserId: string;
      responsibleUserId: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbNonconformity)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        definition: data.definition,
        no: data.no,
        identifiedAt: data.identifiedAt,
        requirement: data.requirement,
        source: data.source,
        potentialResult: data.potentialResult,
        rootCause: data.rootCause,
        action: data.action,
        responsibleUserId: data.responsibleUserId,
        targetIdentificationDate: data.targetIdentificationDate,
        actualIdentificationDate: data.actualIdentificationDate,
        isCorrectiveActionOpen: data.isCorrectiveActionOpen,
        reviewerUserId: data.reviewerUserId,
        reviewerFeedback: data.reviewerFeedback,
      })
      .returning({
        id: TbNonconformity.id,
      });
    return record.id;
  }

  export async function get(c: IContextUser, id: string) {
    const aliasUserResponsible = alias(TbUser, "rs");
    const aliasUserReviewer = alias(TbUser, "rv");
    const [rec] = await c.db
      .select({
        id: TbNonconformity.id,
        definition: TbNonconformity.definition,
        no: TbNonconformity.no,
        identifiedAt: TbNonconformity.identifiedAt,
        requirement: TbNonconformity.requirement,
        source: TbNonconformity.source,
        potentialResult: TbNonconformity.potentialResult,
        rootCause: TbNonconformity.rootCause,
        action: TbNonconformity.action,
        targetIdentificationDate: TbNonconformity.targetIdentificationDate,
        actualIdentificationDate: TbNonconformity.actualIdentificationDate,
        isCorrectiveActionOpen: TbNonconformity.isCorrectiveActionOpen,
        reviewerFeedback: TbNonconformity.reviewerFeedback,
        reviewerUser: {
          id: aliasUserReviewer.id,
          displayName: sql<string>`concat_ws(' ', "rv"."name", "rv"."surname")`,
        },
        responsibleUser: {
          id: aliasUserResponsible.id,
          displayName: sql<string>`concat_ws(' ', "rs"."name", "rs"."surname")`,
        },
      })
      .from(TbNonconformity)
      .innerJoin(
        aliasUserResponsible,
        eq(aliasUserResponsible.id, TbNonconformity.responsibleUserId),
      )
      .innerJoin(
        aliasUserReviewer,
        eq(aliasUserReviewer.id, TbNonconformity.reviewerUserId),
      )
      .where(
        and(
          eq(TbNonconformity.id, id),
          eq(TbNonconformity.orgId, c.session.orgId),
        ),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      definition: string;
      no: number;
      identifiedAt: string;
      requirement: string;
      source: string;
      potentialResult: string;
      rootCause: string;
      action: string;
      responsibleUserId: string;
      targetIdentificationDate: string;
      actualIdentificationDate: string;
      isCorrectiveActionOpen: boolean;
      reviewerUserId: string;
      reviewerFeedback: string;
    },
  ) {
    await c.db
      .update(TbNonconformity)
      .set({
        definition: data.definition,
        no: data.no,
        identifiedAt: data.identifiedAt,
        requirement: data.requirement,
        source: data.source,
        potentialResult: data.potentialResult,
        rootCause: data.rootCause,
        action: data.action,
        responsibleUserId: data.responsibleUserId,
        targetIdentificationDate: data.targetIdentificationDate,
        actualIdentificationDate: data.actualIdentificationDate,
        isCorrectiveActionOpen: data.isCorrectiveActionOpen,
        reviewerUserId: data.reviewerUserId,
        reviewerFeedback: data.reviewerFeedback,
      })
      .where(
        and(
          eq(TbNonconformity.id, id),
          eq(TbNonconformity.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbNonconformity)
      .where(
        and(
          eq(TbNonconformity.id, id),
          eq(TbNonconformity.orgId, c.session.orgId),
        ),
      );
  }
}
