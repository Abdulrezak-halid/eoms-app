import { EApiFailCode } from "common";
import { and, count, eq } from "drizzle-orm";

import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { IPeriod } from "@m/commitment/interfaces/IPeriod";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbComplianceObligation } from "../orm/TbComplianceObligation";
import { TbComplianceObligationArticle } from "../orm/TbComplianceObligationArticle";

export namespace ServiceComplianceObligation {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbComplianceObligation);
  }
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbComplianceObligation.id,
        complianceObligation: TbComplianceObligation.complianceObligation,
        officialNewspaperNo: TbComplianceObligation.officialNewspaperNo,
        officialNewspaperPublicationDate:
          TbComplianceObligation.officialNewspaperPublicationDate,
        reviewPeriod: TbComplianceObligation.reviewPeriod,
        reviewDate: TbComplianceObligation.reviewDate,
        revisionNo: TbComplianceObligation.revisionNo,
        revisionDate: TbComplianceObligation.revisionDate,
        isLegalActive: TbComplianceObligation.isLegalActive,
        articleCount: count(TbComplianceObligationArticle.id),
      })
      .from(TbComplianceObligation)
      .leftJoin(
        TbComplianceObligationArticle,
        and(
          eq(TbComplianceObligationArticle.orgId, TbComplianceObligation.orgId),
          eq(
            TbComplianceObligationArticle.subjectId,
            TbComplianceObligation.id,
          ),
        ),
      )
      .where(eq(TbComplianceObligation.orgId, c.session.orgId))
      .groupBy(TbComplianceObligation.id)
      .orderBy(TbComplianceObligation.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbComplianceObligation.id,
        complianceObligation: TbComplianceObligation.complianceObligation,
        officialNewspaperNo: TbComplianceObligation.officialNewspaperNo,
        officialNewspaperPublicationDate:
          TbComplianceObligation.officialNewspaperPublicationDate,
        reviewPeriod: TbComplianceObligation.reviewPeriod,
        reviewDate: TbComplianceObligation.reviewDate,
        revisionNo: TbComplianceObligation.revisionNo,
        revisionDate: TbComplianceObligation.revisionDate,
        isLegalActive: TbComplianceObligation.isLegalActive,
        articleCount: count(TbComplianceObligationArticle.id),
      })
      .from(TbComplianceObligation)
      .leftJoin(
        TbComplianceObligationArticle,
        and(
          eq(TbComplianceObligationArticle.orgId, TbComplianceObligation.orgId),
          eq(
            TbComplianceObligationArticle.subjectId,
            TbComplianceObligation.id,
          ),
        ),
      )
      .where(
        and(
          eq(TbComplianceObligation.id, id),
          eq(TbComplianceObligation.orgId, c.session.orgId),
        ),
      )
      .groupBy(TbComplianceObligation.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function create(
    c: IContextUser,
    data: {
      complianceObligation: string;
      officialNewspaperNo: string;
      officialNewspaperPublicationDate: string;
      reviewPeriod: IPeriod;
      reviewDate: string;
      revisionNo: string;
      revisionDate: string;
      isLegalActive: boolean;
    },
  ) {
    const [record] = await c.db
      .insert(TbComplianceObligation)
      .values({
        orgId: c.session.orgId,
        complianceObligation: data.complianceObligation,
        officialNewspaperNo: data.officialNewspaperNo,
        officialNewspaperPublicationDate: data.officialNewspaperPublicationDate,
        reviewPeriod: data.reviewPeriod,
        reviewDate: data.reviewDate,
        revisionNo: data.revisionNo,
        revisionDate: data.revisionDate,
        isLegalActive: data.isLegalActive,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .returning({
        id: TbComplianceObligation.id,
      });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      complianceObligation: string;
      officialNewspaperNo: string;
      officialNewspaperPublicationDate: string;
      reviewPeriod: IPeriod;
      reviewDate: string;
      revisionNo: string;
      revisionDate: string;
      isLegalActive: boolean;
    },
  ) {
    await c.db
      .update(TbComplianceObligation)
      .set({
        complianceObligation: data.complianceObligation,
        officialNewspaperNo: data.officialNewspaperNo,
        officialNewspaperPublicationDate: data.officialNewspaperPublicationDate,
        reviewPeriod: data.reviewPeriod,
        reviewDate: data.reviewDate,
        revisionNo: data.revisionNo,
        revisionDate: data.revisionDate,
        isLegalActive: data.isLegalActive,
      })
      .where(
        and(
          eq(TbComplianceObligation.id, id),
          eq(TbComplianceObligation.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbComplianceObligationArticle)
        .where(
          and(
            eq(TbComplianceObligationArticle.orgId, c.session.orgId),
            eq(TbComplianceObligationArticle.subjectId, id),
          ),
        );
      await tx
        .delete(TbComplianceObligation)
        .where(
          and(
            eq(TbComplianceObligation.orgId, c.session.orgId),
            eq(TbComplianceObligation.id, id),
          ),
        );
    });
  }
}
