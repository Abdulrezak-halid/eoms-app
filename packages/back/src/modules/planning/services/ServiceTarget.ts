import { EApiFailCode } from "common";
import { and, eq, gte, lte } from "drizzle-orm";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { TbTarget } from "@m/planning/orm/TbTarget";

export namespace ServiceTarget {
  export async function getAll(
    c: IContextCore,
    orgId: string,
    options?: { datetimeMin?: string; datetimeMax?: string },
  ) {
    const filters = [eq(TbTarget.orgId, orgId)];

    if (options?.datetimeMin) {
      filters.push(gte(TbTarget.createdAt, options.datetimeMin));
    }
    if (options?.datetimeMax) {
      filters.push(lte(TbTarget.createdAt, options.datetimeMax));
    }

    return c.db
      .select({
        id: TbTarget.id,
        year: TbTarget.year,
        energyResource: TbTarget.energyResource,
        consumption: TbTarget.consumption,
        percentage: TbTarget.percentage,
      })
      .from(TbTarget)
      .where(and(...filters))
      .orderBy(TbTarget.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      year: number;
      energyResource: IEnergyResource;
      consumption: number;
      percentage: number;
    },
  ) {
    const [record] = await c.db
      .insert(TbTarget)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        year: data.year,
        energyResource: data.energyResource,
        consumption: data.consumption,
        percentage: data.percentage,
      })
      .returning({ id: TbTarget.id });
    return record.id;
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        year: TbTarget.year,
        energyResource: TbTarget.energyResource,
        consumption: TbTarget.consumption,
        percentage: TbTarget.percentage,
      })
      .from(TbTarget)
      .where(and(eq(TbTarget.orgId, c.session.orgId), eq(TbTarget.id, id)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      year: number;
      energyResource: IEnergyResource;
      consumption: number;
      percentage: number;
    },
  ) {
    await c.db
      .update(TbTarget)
      .set({
        year: data.year,
        energyResource: data.energyResource,
        consumption: data.consumption,
        percentage: data.percentage,
      })
      .where(and(eq(TbTarget.orgId, c.session.orgId), eq(TbTarget.id, id)));
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbTarget)
      .where(and(eq(TbTarget.orgId, c.session.orgId), eq(TbTarget.id, id)));
  }
}
