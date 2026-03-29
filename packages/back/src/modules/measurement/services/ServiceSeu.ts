import { EApiFailCode } from "common";
import { SQL, and, count, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import {
  DataEnergyResource,
  IEnergyResource,
} from "@m/base/interfaces/IEnergyResource";
import { TbDepartment } from "@m/base/orm/TbDepartment";
import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";
import { UtilContext } from "@m/core/utils/UtilContext";
import { UtilDb } from "@m/core/utils/UtilDb";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { IMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";
import { TbMeter } from "../orm/TbMeter";
import { TbMeterSlice } from "../orm/TbMeterSlice";
import { TbSeuDepartment } from "../orm/TbSeuDepartment";
import { TbSeuMeterSlice } from "../orm/TbSeuMeterSlice";
import { VwMeterSlice } from "../orm/VwMeterSlice";
import { VwSeuMeterSliceAll } from "../orm/VwSeuMeterSliceAll";
import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "../utils/UtilMetricValueQuery";
import { ServiceMeterSlice } from "./ServiceMeterSlice";
import { ServiceMetric } from "./ServiceMetric";

export namespace ServiceSeu {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbSeu);
  }

  export async function validateEnergyResource(
    c: IContextUser,
    seuIds: string[],
    energyResource: IEnergyResource,
  ): Promise<void> {
    if (!seuIds.length) {
      return;
    }

    const uniqueSeuIds = [...new Set(seuIds)];

    const [row] = await c.db
      .select({ count: count() })
      .from(TbSeu)
      .where(
        and(
          eq(TbSeu.orgId, c.session.orgId),
          inArray(TbSeu.id, uniqueSeuIds),
          eq(TbSeu.energyResource, energyResource),
        ),
      );

    if (row.count !== uniqueSeuIds.length) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "The energy resource of all selected SEUs must be the same as the selected energy resource.",
      );
    }
  }

  async function validate(
    c: IContextOrg,
    meterSliceIds: string[],
    departmentIds: string[],
    energyResource: IEnergyResource,
  ): Promise<void> {
    if (meterSliceIds.length) {
      // Check if all meter energy resources are the same as seu resource
      const [resCount] = await c.db
        .select({ count: count() })
        .from(TbMeterSlice)
        .innerJoin(
          TbMeter,
          and(
            eq(TbMeter.id, TbMeterSlice.subjectId),
            eq(TbMeter.energyResource, energyResource),
          ),
        )
        .where(inArray(TbMeterSlice.id, meterSliceIds));

      if (meterSliceIds.length !== resCount.count) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "All selected meter slices must have the same energy resource as the SEU.",
        );
      }

      const [mainMeterSlice] = await c.db
        .select({ id: TbMeterSlice.id })
        .from(TbMeterSlice)
        .where(
          and(
            inArray(TbMeterSlice.id, meterSliceIds),
            eq(TbMeterSlice.isMain, true),
          ),
        )
        .limit(1);

      if (mainMeterSlice) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Main meter slices cannot be assigned to an SEU.",
        );
      }

      // Check if selected meter slices are not included from other seus departments
      const [meterSlicesWithSeuDepartments] = await c.db
        .select({
          seuId: TbSeuDepartment.subjectId,
        })
        .from(TbMeterSlice)
        .innerJoin(
          TbMeter,
          and(
            eq(TbMeter.id, TbMeterSlice.subjectId),
            eq(TbMeter.energyResource, energyResource),
          ),
        )
        .innerJoin(
          TbSeuDepartment,
          eq(TbSeuDepartment.departmentId, TbMeterSlice.departmentId),
        )
        .innerJoin(
          TbSeu,
          and(
            eq(TbSeu.id, TbSeuDepartment.subjectId),
            eq(TbSeu.energyResource, energyResource),
          ),
        )
        .where(inArray(TbMeterSlice.id, meterSliceIds))
        .limit(1);

      if (meterSlicesWithSeuDepartments) {
        throw new ApiException(
          EApiFailCode.RECORD_IN_USE,
          "One or more of the selected meter slices belong to departments that are already assigned to another SEU.",
        );
      }
    }

    // Check if selected departments do not include selected meter slices
    if (departmentIds.length) {
      const departmentSlices = await c.db
        .select({
          id: TbMeterSlice.id,
          seuMeterSliceId: TbSeuMeterSlice.id,
        })
        .from(TbMeterSlice)
        .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
        .leftJoin(
          TbSeuMeterSlice,
          eq(TbSeuMeterSlice.meterSliceId, TbMeterSlice.id),
        )
        .where(
          and(
            inArray(TbMeterSlice.departmentId, departmentIds),
            eq(TbMeter.energyResource, energyResource),
            eq(TbMeterSlice.isMain, false),
          ),
        );

      if (departmentSlices.some((slice) => meterSliceIds.includes(slice.id))) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "One or more of the selected meter slices are assigned to the SEU's department.",
        );
      }

      if (departmentSlices.some((slice) => slice.seuMeterSliceId !== null)) {
        throw new ApiException(
          EApiFailCode.RECORD_IN_USE,
          "One or more of the selected department meters are already assigned to another SEU.",
        );
      }
    }
  }

  export async function getAll(
    c: IContextOrg,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      seuIds?: string[];
      primary?: boolean;
      energyResource?: IEnergyResource;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const filters: SQL[] = [eq(TbSeu.orgId, c.orgId)];

    if (query.primary && query.seuIds) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Seu ids and primary queries should not be set together to get seus.",
      );
    }

    if (query.energyResource) {
      filters.push(eq(TbSeu.energyResource, query.energyResource));
    }

    let seuIds = query.seuIds;

    if (query.primary) {
      const primaryRegressions = await ServiceAdvancedRegression.getAllResults(
        c,
        {
          primary: true,
          datetimeMin: query.datetimeMin,
          datetimeMax: query.datetimeMax,
        },
      );

      seuIds = [
        ...new Set(primaryRegressions.flatMap((d) => (d.seu ? d.seu.id : []))),
      ];
    }

    if (seuIds) {
      filters.push(inArray(TbSeu.id, seuIds));
    }

    const records = await c.db
      .select({
        id: TbSeu.id,
        name: TbSeu.name,
        energyResource: TbSeu.energyResource,
        departments: UtilDb.jsonAgg(
          {
            id: TbDepartment.id,
            name: TbDepartment.name,
          },
          { excludeNull: true, distinct: true },
        ),
        meterSlices: UtilDb.jsonAgg(
          {
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
            departmentId: VwMeterSlice.departmentId,
            metricId: VwMeterSlice.metricId,
            energyConversionRate: VwMeterSlice.energyConversionRate,
            rate: VwMeterSlice.rate,
          },
          { excludeNull: true, distinct: true },
        ),
      })
      .from(TbSeu)

      // Selected departments
      .leftJoin(TbSeuDepartment, eq(TbSeuDepartment.subjectId, TbSeu.id))
      .leftJoin(TbDepartment, eq(TbDepartment.id, TbSeuDepartment.departmentId))

      // All meter slices
      .leftJoin(VwSeuMeterSliceAll, eq(VwSeuMeterSliceAll.seuId, TbSeu.id))

      // Slice record
      .leftJoin(
        VwMeterSlice,
        eq(VwMeterSlice.id, VwSeuMeterSliceAll.meterSliceId),
      )

      .where(and(...filters))
      .groupBy(TbSeu.id)
      .orderBy(TbSeu.createdAt);

    const consumptionsByMetricId =
      await ServiceMetric.getTotalCounterValueByMetricId(
        c,
        records.flatMap((d) => d.meterSlices.map((m) => m.metricId)),
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const mainConsumptions = await ServiceMeterSlice.getMainConsumptions(c, {
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    return records.map((d) => {
      const consumption = d.meterSlices.reduce(
        (acc, curr) =>
          (consumptionsByMetricId[curr.metricId] || 0) *
            curr.energyConversionRate *
            curr.rate +
          acc,
        0,
      );

      const mainConsumption = mainConsumptions[d.energyResource] || null;
      return {
        ...d,
        // Meter slices object has unnecessary fields to response,
        //   that's why remapped
        meterSlices: d.meterSlices.map((m) => ({
          id: m.id,
          name: m.name,
          departmentId: m.departmentId,
          rate: m.rate,
        })),
        consumption,
        percentage:
          mainConsumption &&
          consumption &&
          (consumption / mainConsumption) * 100,
      };
    });
  }

  export async function get(
    c: IContextOrg,
    id: string,
    query: { datetimeMin: string; datetimeMax: string },
  ) {
    const [record] = await getAll(c, {
      seuIds: [id],
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    return record;
  }

  export async function getNames(c: IContextOrg) {
    return await c.db
      .select({
        id: TbSeu.id,
        name: TbSeu.name,
        energyResource: TbSeu.energyResource,
      })
      .from(TbSeu)
      .where(eq(TbSeu.orgId, c.orgId))
      .orderBy(TbSeu.createdAt);
  }

  export async function getDepartmentsInUse(c: IContextUser) {
    const records = await c.db
      .select({
        id: TbSeuDepartment.departmentId,
      })
      .from(TbSeuDepartment)
      .where(eq(TbSeuDepartment.orgId, c.session.orgId));
    return records.map((d) => d.id);
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      departmentIds: string[];
      energyResource: IEnergyResource;
      meterSliceIds: string[];
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const [recordCount] = await tx
        .select({ count: count() })
        .from(TbSeuDepartment)
        .innerJoin(TbSeu, eq(TbSeu.id, TbSeuDepartment.subjectId))
        .leftJoin(TbSeuMeterSlice, eq(TbSeuMeterSlice.subjectId, TbSeu.id))
        .leftJoin(
          TbMeterSlice,
          eq(TbMeterSlice.id, TbSeuMeterSlice.meterSliceId),
        )
        .leftJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
        .where(
          and(
            eq(TbSeuDepartment.orgId, c.session.orgId),
            inArray(TbSeuDepartment.departmentId, data.departmentIds),
            eq(TbSeu.energyResource, data.energyResource),
          ),
        );

      if (recordCount.count) {
        throw new ApiException(
          EApiFailCode.RECORD_IN_USE,
          "One or more of the selected departments are already assigned to another SEU.",
        );
      }

      await validate(
        UtilContext.overwriteDb(c, tx),
        data.meterSliceIds,
        data.departmentIds,
        data.energyResource,
      );

      const [record] = await tx
        .insert(TbSeu)
        .values({
          name: data.name,
          energyResource: data.energyResource,
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
        })
        .returning({ id: TbSeu.id });

      if (data.departmentIds.length > 0) {
        await tx.insert(TbSeuDepartment).values(
          data.departmentIds.map((departmentId) => ({
            subjectId: record.id,
            departmentId: departmentId,
            orgId: c.session.orgId,
          })),
        );
      }

      if (data.meterSliceIds.length > 0) {
        await tx.insert(TbSeuMeterSlice).values(
          data.meterSliceIds.map((meterSliceId) => ({
            subjectId: record.id,
            meterSliceId: meterSliceId,
            orgId: c.session.orgId,
          })),
        );
      }

      return record.id;
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      departmentIds: string[];
      energyResource: IEnergyResource;
      meterSliceIds: string[];
    },
  ) {
    await c.db.transaction(async (tx) => {
      const [recordCount] = await tx
        .select({ count: count() })
        .from(TbSeuDepartment)
        .innerJoin(TbSeu, eq(TbSeu.id, TbSeuDepartment.subjectId))
        .where(
          and(
            eq(TbSeuDepartment.orgId, c.orgId),
            inArray(TbSeuDepartment.departmentId, data.departmentIds),
            eq(TbSeu.energyResource, data.energyResource),
            ne(TbSeuDepartment.subjectId, id),
          ),
        );

      if (recordCount.count > 0) {
        throw new ApiException(
          EApiFailCode.RECORD_IN_USE,
          "One or more of the selected departments are already assigned to another SEU.",
        );
      }

      const [record] = await tx
        .update(TbSeu)
        .set({
          name: data.name,
          energyResource: data.energyResource,
        })
        .where(and(eq(TbSeu.id, id), eq(TbSeu.orgId, c.session.orgId)))
        .returning({ id: TbSeu.id });

      if (!record) {
        throw new ApiException(EApiFailCode.BAD_REQUEST);
      }

      await tx.delete(TbSeuDepartment).where(eq(TbSeuDepartment.subjectId, id));

      if (data.departmentIds.length > 0) {
        await tx.insert(TbSeuDepartment).values(
          data.departmentIds.map((departmentId) => ({
            subjectId: id,
            departmentId: departmentId,
            orgId: c.session.orgId,
          })),
        );
      }

      await tx.delete(TbSeuMeterSlice).where(eq(TbSeuMeterSlice.subjectId, id));

      await validate(
        UtilContext.overwriteDb(c, tx),
        data.meterSliceIds,
        data.departmentIds,
        data.energyResource,
      );

      if (data.meterSliceIds.length > 0) {
        await tx.insert(TbSeuMeterSlice).values(
          data.meterSliceIds.map((meterSliceId) => ({
            subjectId: id,
            meterSliceId: meterSliceId,
            orgId: c.session.orgId,
          })),
        );
      }
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx.delete(TbSeuDepartment).where(eq(TbSeuDepartment.subjectId, id));
      await tx.delete(TbSeuMeterSlice).where(eq(TbSeuMeterSlice.subjectId, id));
      const record = await tx
        .delete(TbSeu)
        .where(and(eq(TbSeu.id, id), eq(TbSeu.orgId, c.session.orgId)));

      if (!UtilDb.getAffectedRows(record)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "SEU not found or already deleted.",
        );
      }
    });
  }

  export async function getValues(
    c: IContextOrg,
    id: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      period: IMetricResourceValuePeriod;
      count: number;
      page: number;
    },
  ) {
    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaSeuAgg(
        c,
        [id],
        query.period,
        [query.datetimeMin, query.datetimeMax],
      );

    const [recCount] = await c.db
      .with(tableValues)
      .select({
        count: count(),
      })
      .from(tableValues)
      .where(isNotNull(tableValues.value));

    const records = await c.db
      .with(tableValues)
      .select({
        // Null values are filtered at where section
        value: sql<number>`${tableValues.value}`.as("value"),
        datetime: UtilDb.isoDatetime(tableValues.bucket),
      })
      .from(tableValues)
      .where(isNotNull(tableValues.value))
      .orderBy(tableValues.bucket)
      .limit(query.count)
      .offset((query.page - 1) * query.count);

    return {
      recordCount: recCount?.count || 0,
      records,
    };
  }

  export async function getGraphValues(
    c: IContextOrg,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      seuIds?: string[];
      primary?: boolean;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    let seuIds: string[] = [];

    // Filter by provided seuIds while restricting results to primary SEUs only.
    if (query.primary) {
      const primaryRegressions = await ServiceAdvancedRegression.getAllResults(
        c,
        {
          datetimeMin: query.datetimeMin,
          datetimeMax: query.datetimeMax,
          primary: true,
        },
      );

      seuIds = [
        ...new Set(primaryRegressions.flatMap((d) => (d.seu ? d.seu.id : []))),
      ];
    } else if (query.seuIds) {
      seuIds = query.seuIds;
    } else {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Either primary or seu id list should be given to get seu graph values.",
      );
    }

    const seus = await c.db
      .select({
        id: TbSeu.id,
        name: TbSeu.name,
        energyResource: TbSeu.energyResource,
      })
      .from(TbSeu)
      .where(inArray(TbSeu.id, seuIds));

    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaSeuAgg(
        c,
        seuIds,
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const values = await c.db
      .with(tableValues)
      .select({
        seuId: tableValues.seuId,
        value: sql<number>`${tableValues.value}`.as("value"),
        datetime: UtilDb.isoDatetime(tableValues.bucket),
      })
      .from(tableValues)
      .where(isNotNull(tableValues.value))
      .orderBy(tableValues.seuId, tableValues.bucket);

    const series = seus.map((seu) => {
      const seuValues = values
        .filter((v) => v.seuId === seu.id)
        .map((v) => ({
          datetime: v.datetime,
          value: v.value,
        }));

      return {
        seu: {
          id: seu.id,
          name: seu.name,
          energyResource: seu.energyResource,
        },
        values: seuValues,
      };
    });

    return {
      period,
      series,
    };
  }

  export async function findSuggestions(
    c: IContextOrg,
    query: {
      minConsumptionPercentage: number;
      datetimeMin: string;
      datetimeMax: string;
    },
  ) {
    const [nonMainMeterSlices, mainConsumptions] = await Promise.all([
      ServiceMeterSlice.getAll(c, {
        datetimeMin: query.datetimeMin,
        datetimeMax: query.datetimeMax,
        nonMainOnly: true,
      }),
      ServiceMeterSlice.getMainConsumptions(c, {
        datetimeMin: query.datetimeMin,
        datetimeMax: query.datetimeMax,
      }),
    ]);

    const sortedByResource = new Map<
      IEnergyResource,
      typeof nonMainMeterSlices
    >();

    for (const ms of nonMainMeterSlices) {
      if (!sortedByResource.has(ms.energyResource)) {
        sortedByResource.set(ms.energyResource, []);
      }
      sortedByResource.get(ms.energyResource)!.push(ms);
    }

    for (const meters of sortedByResource.values()) {
      meters.sort((a, b) => (b.consumption ?? 0) - (a.consumption ?? 0));
    }

    const groups: Map<
      string,
      {
        name: string;
        energyResource: IEnergyResource;
        meterSlices: { id: string; name: string }[];
      }
    > = new Map();

    for (const resourceType of DataEnergyResource) {
      const threshold =
        ((mainConsumptions[resourceType] ?? 0) *
          query.minConsumptionPercentage) /
        100;
      const meters = sortedByResource.get(resourceType) ?? [];

      let runningSum = 0;

      for (const meter of meters) {
        if (runningSum >= threshold) {
          break;
        }

        runningSum += meter.consumption ?? 0;

        const key = `${resourceType}|${meter.department.id}`;

        const meterObj = {
          id: meter.id,
          name: meter.name,
        };

        if (groups.has(key)) {
          groups.get(key)!.meterSlices.push(meterObj);
        } else {
          groups.set(key, {
            name: meter.department.name,
            energyResource: resourceType,
            meterSlices: [meterObj],
          });
        }
      }
    }

    return Array.from(groups.values());
  }
}
