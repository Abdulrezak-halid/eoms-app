import { EApiFailCode } from "common";
import { and, count, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbDesign } from "../orm/TbDesign";
import { TbDesignIdea } from "../orm/TbDesignIdea";

export namespace ServiceDesign {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbDesign);
  }
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbDesign.id,
        name: TbDesign.name,
        no: TbDesign.no,
        purpose: TbDesign.purpose,
        impact: TbDesign.impact,
        estimatedSavings: TbDesign.estimatedSavings,
        estimatedAdditionalCost: TbDesign.estimatedAdditionalCost,
        estimatedTurnaroundMonths: TbDesign.estimatedTurnaroundMonths,
        leaderUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        potentialNonEnergyBenefits: TbDesign.potentialNonEnergyBenefits,
        ideaCount: count(TbDesignIdea.id),
      })
      .from(TbDesign)
      .innerJoin(TbUser, eq(TbUser.id, TbDesign.leaderUserId))
      .leftJoin(
        TbDesignIdea,
        and(
          eq(TbDesignIdea.orgId, TbDesign.orgId),
          eq(TbDesignIdea.designId, TbDesign.id),
        ),
      )
      .where(eq(TbDesign.orgId, c.session.orgId))
      .groupBy(TbDesign.id, TbUser.id, sqlUserDisplayName())
      .orderBy(TbDesign.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbDesign.id,
        name: TbDesign.name,
        no: TbDesign.no,
        purpose: TbDesign.purpose,
        impact: TbDesign.impact,
        estimatedSavings: TbDesign.estimatedSavings,
        estimatedAdditionalCost: TbDesign.estimatedAdditionalCost,
        estimatedTurnaroundMonths: TbDesign.estimatedTurnaroundMonths,
        leaderUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        potentialNonEnergyBenefits: TbDesign.potentialNonEnergyBenefits,
        ideaCount: count(TbDesignIdea.id),
      })
      .from(TbDesign)
      .innerJoin(TbUser, eq(TbUser.id, TbDesign.leaderUserId))
      .leftJoin(
        TbDesignIdea,
        and(
          eq(TbDesignIdea.orgId, TbDesign.orgId),
          eq(TbDesignIdea.designId, TbDesign.id),
        ),
      )
      .where(and(eq(TbDesign.orgId, c.session.orgId), eq(TbDesign.id, id)))
      .groupBy(TbDesign.id, TbUser.id, sqlUserDisplayName());

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      no: number;
      purpose: string;
      impact: string;
      estimatedSavings: number;
      estimatedAdditionalCost: number;
      estimatedTurnaroundMonths: number;
      leaderUserId: string;
      potentialNonEnergyBenefits: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbDesign)
      .values({
        orgId: c.session.orgId,
        name: data.name,
        no: data.no,
        purpose: data.purpose,
        impact: data.impact,
        estimatedSavings: data.estimatedSavings,
        estimatedAdditionalCost: data.estimatedAdditionalCost,
        estimatedTurnaroundMonths: data.estimatedTurnaroundMonths,
        leaderUserId: data.leaderUserId,
        potentialNonEnergyBenefits: data.potentialNonEnergyBenefits,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .returning({
        id: TbDesign.id,
      });
    return record.id;
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      no: number;
      purpose: string;
      impact: string;
      estimatedSavings: number;
      estimatedAdditionalCost: number;
      estimatedTurnaroundMonths: number;
      leaderUserId: string;
      potentialNonEnergyBenefits: string;
    },
  ) {
    await c.db
      .update(TbDesign)
      .set({
        name: data.name,
        no: data.no,
        purpose: data.purpose,
        impact: data.impact,
        estimatedSavings: data.estimatedSavings,
        estimatedAdditionalCost: data.estimatedAdditionalCost,
        estimatedTurnaroundMonths: data.estimatedTurnaroundMonths,
        leaderUserId: data.leaderUserId,
        potentialNonEnergyBenefits: data.potentialNonEnergyBenefits,
      })
      .where(and(eq(TbDesign.orgId, c.session.orgId), eq(TbDesign.id, id)));
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbDesignIdea)
        .where(
          and(
            eq(TbDesignIdea.orgId, c.session.orgId),
            eq(TbDesignIdea.designId, id),
          ),
        );
      await tx
        .delete(TbDesign)
        .where(and(eq(TbDesign.orgId, c.session.orgId), eq(TbDesign.id, id)));
    });
  }
}
