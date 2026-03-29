import { EApiFailCode } from "common";
import { SQL, and, eq, gte, lte, or } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import type { IContextCore, IContextUser } from "@m/core/interfaces/IContext";

import type { IDocumentApprovementStatus } from "../interfaces/IDocumentApprovementStatus";
import { TbActionPlan } from "../orm/TbActionPlan";

export namespace ServiceActionPlan {
  export async function getAll(
    c: IContextCore,
    orgId: string,
    options?: { datetimeMin?: string; datetimeMax?: string },
  ) {
    const filters: (SQL | undefined)[] = [eq(TbActionPlan.orgId, orgId)];

    if (options?.datetimeMin || options?.datetimeMax) {
      const filter1 = [];
      const filter2 = [];
      const filter3 = [];
      const filter4 = [];

      if (options?.datetimeMin) {
        filter1.push(gte(TbActionPlan.createdAt, options.datetimeMin));
        filter2.push(gte(TbActionPlan.startDate, options.datetimeMin));
        filter3.push(
          gte(TbActionPlan.actualIdentificationDate, options.datetimeMin),
        );
        filter4.push(
          gte(TbActionPlan.targetIdentificationDate, options.datetimeMin),
        );
      }

      if (options?.datetimeMax) {
        filter1.push(lte(TbActionPlan.createdAt, options.datetimeMax));
        filter2.push(lte(TbActionPlan.startDate, options.datetimeMax));
        filter3.push(
          lte(TbActionPlan.actualIdentificationDate, options.datetimeMax),
        );
        filter4.push(
          lte(TbActionPlan.targetIdentificationDate, options.datetimeMax),
        );
      }

      filters.push(
        or(and(...filter1), and(...filter2), and(...filter3), and(...filter4)),
      );
    }

    return await c.db
      .select({
        id: TbActionPlan.id,
        name: TbActionPlan.name,
        reasonsForStatus: TbActionPlan.reasonsForStatus,
        actualSavingsVerifications: TbActionPlan.actualSavingsVerifications,
        actualSavings: TbActionPlan.actualSavings,
        startDate: TbActionPlan.startDate,
        targetIdentificationDate: TbActionPlan.targetIdentificationDate,
        actualIdentificationDate: TbActionPlan.actualIdentificationDate,
        approvementStatus: TbActionPlan.approvementStatus,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
      })
      .from(TbActionPlan)
      .innerJoin(TbUser, eq(TbUser.id, TbActionPlan.responsibleUserId))
      .where(and(...filters))
      .orderBy(TbActionPlan.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      reasonsForStatus: string;
      actualSavingsVerifications: string;
      actualSavings: string;
      startDate: string;
      targetIdentificationDate: string;
      actualIdentificationDate: string;
      approvementStatus: IDocumentApprovementStatus;
      responsibleUserId: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbActionPlan)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        name: data.name,
        reasonsForStatus: data.reasonsForStatus,
        actualSavingsVerifications: data.actualSavingsVerifications,
        actualSavings: data.actualSavings,
        startDate: data.startDate,
        targetIdentificationDate: data.targetIdentificationDate,
        actualIdentificationDate: data.actualIdentificationDate,
        approvementStatus: data.approvementStatus,
        responsibleUserId: data.responsibleUserId,
      })
      .returning({ id: TbActionPlan.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      reasonsForStatus: string;
      actualSavingsVerifications: string;
      actualSavings: string;
      startDate: string;
      targetIdentificationDate: string;
      actualIdentificationDate: string;
      approvementStatus: IDocumentApprovementStatus;
      responsibleUserId: string;
    },
  ) {
    await c.db
      .update(TbActionPlan)
      .set({
        name: data.name,
        reasonsForStatus: data.reasonsForStatus,
        actualSavingsVerifications: data.actualSavingsVerifications,
        actualSavings: data.actualSavings,
        startDate: data.startDate,
        targetIdentificationDate: data.targetIdentificationDate,
        actualIdentificationDate: data.actualIdentificationDate,
        approvementStatus: data.approvementStatus,
        responsibleUserId: data.responsibleUserId,
      })
      .where(
        and(eq(TbActionPlan.id, id), eq(TbActionPlan.orgId, c.session.orgId)),
      );
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbActionPlan.id,
        name: TbActionPlan.name,
        reasonsForStatus: TbActionPlan.reasonsForStatus,
        actualSavingsVerifications: TbActionPlan.actualSavingsVerifications,
        actualSavings: TbActionPlan.actualSavings,
        startDate: TbActionPlan.startDate,
        targetIdentificationDate: TbActionPlan.targetIdentificationDate,
        actualIdentificationDate: TbActionPlan.actualIdentificationDate,
        approvementStatus: TbActionPlan.approvementStatus,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
      })
      .from(TbActionPlan)
      .innerJoin(TbUser, eq(TbUser.id, TbActionPlan.responsibleUserId))
      .where(
        and(eq(TbActionPlan.orgId, c.session.orgId), eq(TbActionPlan.id, id)),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return rec;
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbActionPlan)
      .where(
        and(eq(TbActionPlan.orgId, c.session.orgId), eq(TbActionPlan.id, id)),
      );
  }
}
