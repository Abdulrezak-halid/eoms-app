import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbProcurement } from "../orm/TbProcurement";

export namespace ServiceProcurement {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbProcurement.id,
        product: TbProcurement.product,
        category: TbProcurement.category,
        criteriaList: TbProcurement.criteriaList,
        suggestedBrand: TbProcurement.suggestedBrand,
        additionalSpecifications: TbProcurement.additionalSpecifications,
        price: TbProcurement.price,
        annualMaintenanceCost: TbProcurement.annualMaintenanceCost,
        lifetimeYears: TbProcurement.lifetimeYears,
      })
      .from(TbProcurement)
      .where(eq(TbProcurement.orgId, c.session.orgId))
      .orderBy(TbProcurement.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbProcurement.id,
        product: TbProcurement.product,
        category: TbProcurement.category,
        criteriaList: TbProcurement.criteriaList,
        suggestedBrand: TbProcurement.suggestedBrand,
        additionalSpecifications: TbProcurement.additionalSpecifications,
        price: TbProcurement.price,
        annualMaintenanceCost: TbProcurement.annualMaintenanceCost,
        lifetimeYears: TbProcurement.lifetimeYears,
      })
      .from(TbProcurement)
      .where(
        and(eq(TbProcurement.orgId, c.session.orgId), eq(TbProcurement.id, id)),
      );

    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }

  export async function create(
    c: IContextUser,
    data: {
      product: string;
      category: string;
      criteriaList: string;
      suggestedBrand: string;
      additionalSpecifications: string;
      price: number;
      annualMaintenanceCost: number;
      lifetimeYears: number;
    },
  ) {
    const [record] = await c.db
      .insert(TbProcurement)
      .values({
        orgId: c.session.orgId,
        product: data.product,
        category: data.category,
        criteriaList: data.criteriaList,
        suggestedBrand: data.suggestedBrand,
        additionalSpecifications: data.additionalSpecifications,
        price: data.price,
        annualMaintenanceCost: data.annualMaintenanceCost,
        lifetimeYears: data.lifetimeYears,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
      })
      .returning({
        id: TbProcurement.id,
      });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      product: string;
      category: string;
      criteriaList: string;
      suggestedBrand: string;
      additionalSpecifications: string;
      price: number;
      annualMaintenanceCost: number;
      lifetimeYears: number;
    },
  ) {
    await c.db
      .update(TbProcurement)
      .set({
        product: data.product,
        category: data.category,
        criteriaList: data.criteriaList,
        suggestedBrand: data.suggestedBrand,
        additionalSpecifications: data.additionalSpecifications,
        price: data.price,
        annualMaintenanceCost: data.annualMaintenanceCost,
        lifetimeYears: data.lifetimeYears,
      })
      .where(
        and(eq(TbProcurement.orgId, c.session.orgId), eq(TbProcurement.id, id)),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbProcurement)
      .where(
        and(eq(TbProcurement.orgId, c.session.orgId), eq(TbProcurement.id, id)),
      );
  }
}
