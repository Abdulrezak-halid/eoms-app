import { EApiFailCode } from "common";
import { and, eq, gte, lte } from "drizzle-orm";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import type { IDocumentApprovementStatus } from "../interfaces/IDocumentApprovementStatus";
import { TbEnergySavingOpportunity } from "../orm/TbEnergySavingOpportunity";
import { TbEnergySavingOpportunitySeu } from "../orm/TbEnergySavingOpportunitySeu";

export namespace ServiceEnergySavingOpportunity {
  export async function getAll(
    c: IContextCore,
    orgId: string,
    options?: { datetimeMin?: string; datetimeMax?: string },
  ) {
    const filters = [eq(TbEnergySavingOpportunity.orgId, orgId)];

    if (options?.datetimeMin) {
      filters.push(
        gte(TbEnergySavingOpportunity.createdAt, options.datetimeMin),
      );
    }
    if (options?.datetimeMax) {
      filters.push(
        lte(TbEnergySavingOpportunity.createdAt, options.datetimeMax),
      );
    }

    return await c.db
      .select({
        id: TbEnergySavingOpportunity.id,
        name: TbEnergySavingOpportunity.name,
        notes: TbEnergySavingOpportunity.notes,
        investmentApplicationPeriodMonth:
          TbEnergySavingOpportunity.investmentApplicationPeriodMonth,
        approvementStatus: TbEnergySavingOpportunity.approvementStatus,
        investmentBudget: TbEnergySavingOpportunity.investmentBudget,
        estimatedBudgetSaving: TbEnergySavingOpportunity.estimatedBudgetSaving,
        paybackMonth: TbEnergySavingOpportunity.paybackMonth,
        calculationMethodOfPayback:
          TbEnergySavingOpportunity.calculationMethodOfPayback,
        estimatedSavings: TbEnergySavingOpportunity.estimatedSavings,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        seus: UtilDb.jsonAgg({
          id: TbSeu.id,
          name: TbSeu.name,
        }),
      })
      .from(TbEnergySavingOpportunity)
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbEnergySavingOpportunity.responsibleUserId),
      )
      .innerJoin(
        TbEnergySavingOpportunitySeu,
        eq(
          TbEnergySavingOpportunitySeu.subjectId,
          TbEnergySavingOpportunity.id,
        ),
      )
      .innerJoin(TbSeu, eq(TbSeu.id, TbEnergySavingOpportunitySeu.seuId))

      .where(and(...filters))
      .groupBy(TbEnergySavingOpportunity.id, TbUser.id, sqlUserDisplayName())
      .orderBy(TbEnergySavingOpportunity.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      notes: string | null;
      investmentApplicationPeriodMonth: number;
      investmentBudget: number;
      estimatedBudgetSaving: number;
      paybackMonth: number;
      calculationMethodOfPayback: string;
      estimatedSavings: {
        energyResource: IEnergyResource;
        value: number;
      }[];
      approvementStatus: IDocumentApprovementStatus;
      responsibleUserId: string;
      seuIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbEnergySavingOpportunity)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name: data.name,
          notes: data.notes,
          responsibleUserId: data.responsibleUserId,
          approvementStatus: data.approvementStatus,
          investmentBudget: data.investmentBudget,
          estimatedBudgetSaving: data.estimatedBudgetSaving,
          paybackMonth: data.paybackMonth,
          calculationMethodOfPayback: data.calculationMethodOfPayback,
          estimatedSavings: data.estimatedSavings,
          investmentApplicationPeriodMonth:
            data.investmentApplicationPeriodMonth,
        })
        .returning({ id: TbEnergySavingOpportunity.id });
      await tx.insert(TbEnergySavingOpportunitySeu).values(
        data.seuIds.map((id) => ({
          subjectId: record.id,
          seuId: id,
        })),
      );
      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      notes: string | null;
      investmentApplicationPeriodMonth: number;
      investmentBudget: number;
      estimatedBudgetSaving: number;
      paybackMonth: number;
      calculationMethodOfPayback: string;
      estimatedSavings: {
        energyResource: IEnergyResource;
        value: number;
      }[];
      approvementStatus: IDocumentApprovementStatus;
      responsibleUserId: string;
      seuIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbEnergySavingOpportunity)
        .set({
          name: data.name,
          notes: data.notes,
          responsibleUserId: data.responsibleUserId,
          investmentBudget: data.investmentBudget,
          estimatedBudgetSaving: data.estimatedBudgetSaving,
          paybackMonth: data.paybackMonth,
          calculationMethodOfPayback: data.calculationMethodOfPayback,
          estimatedSavings: data.estimatedSavings,
          approvementStatus: data.approvementStatus,
          investmentApplicationPeriodMonth:
            data.investmentApplicationPeriodMonth,
        })

        .where(
          and(
            eq(TbEnergySavingOpportunity.id, id),
            eq(TbEnergySavingOpportunity.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbEnergySavingOpportunity.id });
      if (!record) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }

      await tx
        .delete(TbEnergySavingOpportunitySeu)
        .where(eq(TbEnergySavingOpportunitySeu.subjectId, id));

      if (data.seuIds.length > 0) {
        await tx.insert(TbEnergySavingOpportunitySeu).values(
          data.seuIds.map((seuId) => ({
            subjectId: record.id,
            seuId: seuId,
          })),
        );
      }
    });
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbEnergySavingOpportunity.id,
        name: TbEnergySavingOpportunity.name,
        notes: TbEnergySavingOpportunity.notes,
        approvementStatus: TbEnergySavingOpportunity.approvementStatus,
        investmentApplicationPeriodMonth:
          TbEnergySavingOpportunity.investmentApplicationPeriodMonth,
        paybackMonth: TbEnergySavingOpportunity.paybackMonth,
        investmentBudget: TbEnergySavingOpportunity.investmentBudget,
        estimatedBudgetSaving: TbEnergySavingOpportunity.estimatedBudgetSaving,
        calculationMethodOfPayback:
          TbEnergySavingOpportunity.calculationMethodOfPayback,
        estimatedSavings: TbEnergySavingOpportunity.estimatedSavings,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        seus: UtilDb.jsonAgg({
          id: TbSeu.id,
          name: TbSeu.name,
        }),
      })
      .from(TbEnergySavingOpportunity)
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbEnergySavingOpportunity.responsibleUserId),
      )
      .innerJoin(
        TbEnergySavingOpportunitySeu,
        eq(
          TbEnergySavingOpportunitySeu.subjectId,
          TbEnergySavingOpportunity.id,
        ),
      )
      .innerJoin(TbSeu, eq(TbSeu.id, TbEnergySavingOpportunitySeu.seuId))

      .where(
        and(
          eq(TbEnergySavingOpportunity.orgId, c.session.orgId),
          eq(TbEnergySavingOpportunity.id, id),
        ),
      )
      .groupBy(TbEnergySavingOpportunity.id, TbUser.id, sqlUserDisplayName());

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbEnergySavingOpportunitySeu)
        .where(and(eq(TbEnergySavingOpportunitySeu.subjectId, id)));

      const rec = await tx
        .delete(TbEnergySavingOpportunity)
        .where(
          and(
            eq(TbEnergySavingOpportunity.orgId, c.session.orgId),
            eq(TbEnergySavingOpportunity.id, id),
          ),
        );
      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
    });
  }
}
