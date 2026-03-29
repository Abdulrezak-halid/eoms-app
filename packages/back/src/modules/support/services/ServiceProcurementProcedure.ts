import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { TbProcurementProcedure } from "../orm/TbProcurementProcedure";

export namespace ServiceProcurementProcedure {
  export async function getAll(c: IContextUser) {
    return await c.db
      .select({
        id: TbProcurementProcedure.id,
        equipmentSpecifications: TbProcurementProcedure.equipmentSpecifications,
        serviceSpecifications: TbProcurementProcedure.serviceSpecifications,
        nextReviewAt: TbProcurementProcedure.nextReviewAt,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
      })
      .from(TbProcurementProcedure)
      .innerJoin(TbSeu, eq(TbSeu.id, TbProcurementProcedure.seuId))
      .where(eq(TbProcurementProcedure.orgId, c.session.orgId))
      .orderBy(TbProcurementProcedure.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbProcurementProcedure.id,
        equipmentSpecifications: TbProcurementProcedure.equipmentSpecifications,
        serviceSpecifications: TbProcurementProcedure.serviceSpecifications,
        nextReviewAt: TbProcurementProcedure.nextReviewAt,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
      })
      .from(TbProcurementProcedure)
      .innerJoin(TbSeu, eq(TbSeu.id, TbProcurementProcedure.seuId))
      .where(
        and(
          eq(TbProcurementProcedure.orgId, c.session.orgId),
          eq(TbProcurementProcedure.id, id),
        ),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }
  export async function create(
    c: IContextUser,
    data: {
      equipmentSpecifications: string;
      serviceSpecifications: string;
      nextReviewAt: string;
      seuId: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbProcurementProcedure)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        equipmentSpecifications: data.equipmentSpecifications,
        serviceSpecifications: data.serviceSpecifications,
        nextReviewAt: data.nextReviewAt,
        seuId: data.seuId,
      })
      .returning({ id: TbProcurementProcedure.id });
    return record.id;
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      equipmentSpecifications: string;
      serviceSpecifications: string;
      nextReviewAt: string;
      seuId: string;
    },
  ) {
    await c.db
      .update(TbProcurementProcedure)
      .set({
        equipmentSpecifications: data.equipmentSpecifications,
        serviceSpecifications: data.serviceSpecifications,
        nextReviewAt: data.nextReviewAt,
        seuId: data.seuId,
      })
      .where(
        and(
          eq(TbProcurementProcedure.id, id),
          eq(TbProcurementProcedure.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbProcurementProcedure)
      .where(
        and(
          eq(TbProcurementProcedure.orgId, c.session.orgId),
          eq(TbProcurementProcedure.id, id),
        ),
      );
  }
}
