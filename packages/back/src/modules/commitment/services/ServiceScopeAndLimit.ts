import { EApiFailCode } from "common";
import { and, eq, gte, lte } from "drizzle-orm";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbDepartment } from "@m/base/orm/TbDepartment";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbScopeAndLimit } from "../orm/TbScopeAndLimit";
import { TbScopeAndLimitDepartment } from "../orm/TbScopeAndLimitDepartment";

export namespace ServiceScopeAndLimit {
  export async function getAll(
    c: IContextCore,
    orgId: string,
    options?: { datetimeMin?: string; datetimeMax?: string },
  ) {
    const filters = [eq(TbScopeAndLimit.orgId, orgId)];

    if (options?.datetimeMin) {
      filters.push(gte(TbScopeAndLimit.createdAt, options.datetimeMin));
    }
    if (options?.datetimeMax) {
      filters.push(lte(TbScopeAndLimit.createdAt, options.datetimeMax));
    }

    return await c.db
      .select({
        id: TbScopeAndLimit.id,
        physicalLimits: TbScopeAndLimit.physicalLimits,
        excludedResources: TbScopeAndLimit.excludedResources,
        excludedResourceReason: TbScopeAndLimit.excludedResourceReason,
        products: TbScopeAndLimit.products,
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbScopeAndLimit)
      .innerJoin(
        TbScopeAndLimitDepartment,
        eq(TbScopeAndLimitDepartment.subjectId, TbScopeAndLimit.id),
      )
      .innerJoin(
        TbDepartment,
        eq(TbDepartment.id, TbScopeAndLimitDepartment.departmentId),
      )
      .where(and(...filters))
      .groupBy(TbScopeAndLimit.id)
      .orderBy(TbScopeAndLimit.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbScopeAndLimit.id,
        physicalLimits: TbScopeAndLimit.physicalLimits,
        excludedResources: TbScopeAndLimit.excludedResources,
        excludedResourceReason: TbScopeAndLimit.excludedResourceReason,
        products: TbScopeAndLimit.products,
        departments: UtilDb.jsonAgg({
          id: TbDepartment.id,
          name: TbDepartment.name,
        }),
      })
      .from(TbScopeAndLimit)
      .innerJoin(
        TbScopeAndLimitDepartment,
        eq(TbScopeAndLimitDepartment.subjectId, TbScopeAndLimit.id),
      )
      .innerJoin(
        TbDepartment,
        eq(TbDepartment.id, TbScopeAndLimitDepartment.departmentId),
      )
      .where(
        and(
          eq(TbScopeAndLimit.orgId, c.session.orgId),
          eq(TbScopeAndLimit.id, id),
        ),
      )
      .groupBy(TbScopeAndLimit.id);
    if (!rec) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return rec;
  }
  export async function create(
    c: IContextUser,
    data: {
      physicalLimits: string;
      excludedResources: IEnergyResource[];
      excludedResourceReason: string;
      products: string[];
      departmentIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [record] = await tx
        .insert(TbScopeAndLimit)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          physicalLimits: data.physicalLimits,
          excludedResources: data.excludedResources,
          excludedResourceReason: data.excludedResourceReason,
          products: data.products,
        })
        .returning({ id: TbScopeAndLimit.id });
      await tx.insert(TbScopeAndLimitDepartment).values(
        data.departmentIds.map((id) => ({
          subjectId: record.id,
          departmentId: id,
        })),
      );
      return record.id;
    });
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      physicalLimits: string;
      excludedResources: IEnergyResource[];
      excludedResourceReason: string;
      products: string[];
      departmentIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [record] = await tx
        .update(TbScopeAndLimit)
        .set({
          physicalLimits: data.physicalLimits,
          excludedResources: data.excludedResources,
          excludedResourceReason: data.excludedResourceReason,
          products: data.products,
        })
        .where(
          and(
            eq(TbScopeAndLimit.orgId, c.session.orgId),
            eq(TbScopeAndLimit.id, id),
          ),
        )
        .returning({ id: TbScopeAndLimit.id });
      if (!record) {
        throw new ApiException(EApiFailCode.NOT_FOUND);
      }
      await tx
        .delete(TbScopeAndLimitDepartment)
        .where(eq(TbScopeAndLimitDepartment.subjectId, id));
      if (data.departmentIds.length > 0) {
        await tx.insert(TbScopeAndLimitDepartment).values(
          data.departmentIds.map((departmentId) => ({
            subjectId: record.id,
            departmentId: departmentId,
          })),
        );
      }
    });
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbScopeAndLimitDepartment)
        .where(and(eq(TbScopeAndLimitDepartment.subjectId, id)));

      const rec = await tx
        .delete(TbScopeAndLimit)
        .where(
          and(
            eq(TbScopeAndLimit.orgId, c.session.orgId),
            eq(TbScopeAndLimit.id, id),
          ),
        );
      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Scope and Limit record not found or already deleted.",
        );
      }
    });
  }
}
