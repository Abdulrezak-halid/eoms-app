import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IPlanType } from "../interfaces/IPlanType";
import { TbCommunicationAwarenessPlan } from "../orm/TbCommunicationAwarenessPlan";
import { TbCommunicationAwarenessPlanTargetUser } from "../orm/TbCommunicationAwarenessPlanTargetUser";

export namespace ServiceCommunicationAwarenessPlan {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbCommunicationAwarenessPlan.id,
        action: TbCommunicationAwarenessPlan.action,
        type: TbCommunicationAwarenessPlan.type,
        information: TbCommunicationAwarenessPlan.information,
        releasedAt: TbCommunicationAwarenessPlan.releasedAt,
        releaseLocations: TbCommunicationAwarenessPlan.releaseLocations,
        feedback: TbCommunicationAwarenessPlan.feedback,
        targetUsers: UtilDb.jsonAgg({
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        }),
      })
      .from(TbCommunicationAwarenessPlan)
      .innerJoin(
        TbCommunicationAwarenessPlanTargetUser,
        eq(
          TbCommunicationAwarenessPlanTargetUser.subjectId,
          TbCommunicationAwarenessPlan.id,
        ),
      )
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbCommunicationAwarenessPlanTargetUser.userId),
      )
      .where(eq(TbCommunicationAwarenessPlan.orgId, c.session.orgId))
      .groupBy(TbCommunicationAwarenessPlan.id)
      .orderBy(TbCommunicationAwarenessPlan.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbCommunicationAwarenessPlan.id,
        action: TbCommunicationAwarenessPlan.action,
        type: TbCommunicationAwarenessPlan.type,
        information: TbCommunicationAwarenessPlan.information,
        releasedAt: TbCommunicationAwarenessPlan.releasedAt,
        releaseLocations: TbCommunicationAwarenessPlan.releaseLocations,
        feedback: TbCommunicationAwarenessPlan.feedback,
        targetUsers: UtilDb.jsonAgg({
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        }),
      })
      .from(TbCommunicationAwarenessPlan)
      .innerJoin(
        TbCommunicationAwarenessPlanTargetUser,
        eq(
          TbCommunicationAwarenessPlanTargetUser.subjectId,
          TbCommunicationAwarenessPlan.id,
        ),
      )
      .innerJoin(
        TbUser,
        eq(TbUser.id, TbCommunicationAwarenessPlanTargetUser.userId),
      )
      .where(
        and(
          eq(TbCommunicationAwarenessPlan.orgId, c.session.orgId),
          eq(TbCommunicationAwarenessPlan.id, id),
        ),
      )
      .groupBy(TbCommunicationAwarenessPlan.id);

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function create(
    c: IContextUser,
    data: {
      action: string;
      type: IPlanType;
      information: string;
      releasedAt: string;
      releaseLocations: string[];
      feedback: string;
      targetUserIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbCommunicationAwarenessPlan)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          action: data.action,
          type: data.type,
          information: data.information,
          releasedAt: data.releasedAt,
          releaseLocations: data.releaseLocations,
          feedback: data.feedback,
        })
        .returning({ id: TbCommunicationAwarenessPlan.id });
      await tx.insert(TbCommunicationAwarenessPlanTargetUser).values(
        data.targetUserIds.map((id) => ({
          subjectId: record.id,
          userId: id,
        })),
      );
      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      action: string;
      type: IPlanType;
      information: string;
      releasedAt: string;
      releaseLocations: string[];
      feedback: string;
      targetUserIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbCommunicationAwarenessPlan)
        .set({
          action: data.action,
          type: data.type,
          information: data.information,
          releasedAt: data.releasedAt,
          releaseLocations: data.releaseLocations,
          feedback: data.feedback,
        })
        .where(
          and(
            eq(TbCommunicationAwarenessPlan.id, id),
            eq(TbCommunicationAwarenessPlan.orgId, c.session.orgId),
          ),
        )
        .returning({ id: TbCommunicationAwarenessPlan.id });
      if (!record) {
        throw new ApiException(EApiFailCode.BAD_REQUEST);
      }

      await tx
        .delete(TbCommunicationAwarenessPlanTargetUser)
        .where(eq(TbCommunicationAwarenessPlanTargetUser.subjectId, id));

      if (data.targetUserIds.length > 0) {
        await tx.insert(TbCommunicationAwarenessPlanTargetUser).values(
          data.targetUserIds.map((userId) => ({
            subjectId: record.id,
            userId: userId,
          })),
        );
      }
    });
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbCommunicationAwarenessPlanTargetUser)
        .where(eq(TbCommunicationAwarenessPlanTargetUser.subjectId, id));

      const rec = await tx
        .delete(TbCommunicationAwarenessPlan)
        .where(
          and(
            eq(TbCommunicationAwarenessPlan.orgId, c.session.orgId),
            eq(TbCommunicationAwarenessPlan.id, id),
          ),
        );

      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
    });
  }
}
