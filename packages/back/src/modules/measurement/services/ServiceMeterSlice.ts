import { EApiFailCode } from "common";
import { and, eq, inArray, isNotNull, notInArray, sql } from "drizzle-orm";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";
import { TbMeter } from "../orm/TbMeter";
import { TbMeterSlice } from "../orm/TbMeterSlice";
import { TbSeuMeterSlice } from "../orm/TbSeuMeterSlice";
import { VwMeterSlice } from "../orm/VwMeterSlice";
import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "../utils/UtilMetricValueQuery";

export namespace ServiceMeterSlice {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbMeterSlice);
  }

  // export async function validateNonMain(c: IContextOrg, ids: string[]) {
  //   const [row] = await c.db
  //     .select({ id: TbMeterSlice.id })
  //     .from(TbMeterSlice)
  //     .where(
  //       and(
  //         eq(TbMeterSlice.orgId, c.orgId),
  //         inArray(TbMeterSlice.id, ids),
  //         eq(TbMeterSlice.isMain, true),
  //       ),
  //     )
  //     .limit(1);

  //   if (row) {
  //     throw new ApiException(EApiFailCode.BAD_REQUEST, "Some slices are main.");
  //   }
  // }

  export async function validateEnergyResource(
    c: IContextUser,
    ids: string[],
    energyResource: IEnergyResource,
  ): Promise<void> {
    if (!ids.length) {
      return;
    }

    const uniqueIds = [...new Set(ids)];
    const records = await c.db
      .select({ id: TbMeterSlice.id })
      .from(TbMeterSlice)
      .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
      .where(
        and(
          inArray(TbMeterSlice.id, uniqueIds),
          eq(TbMeterSlice.orgId, c.session.orgId),
          eq(TbMeter.energyResource, energyResource),
        ),
      );

    if (records.length !== uniqueIds.length) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "All selected meter slices must have the same energy energyResource as the selected energy energyResource.",
      );
    }
  }

  export async function getAll(
    c: IContextOrg,
    query: {
      energyResource?: IEnergyResource;
      datetimeMin: string;
      datetimeMax: string;
      noPercentage?: boolean;
      mainOnly?: boolean;
      nonMainOnly?: boolean;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterSliceAgg(
        c,
        undefined,
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const filters = [eq(VwMeterSlice.orgId, c.orgId)];

    if (query.energyResource) {
      filters.push(eq(VwMeterSlice.energyResource, query.energyResource));
    }

    if (query.mainOnly) {
      filters.push(eq(VwMeterSlice.isMain, true));
    } else if (query.nonMainOnly) {
      filters.push(eq(VwMeterSlice.isMain, false));
    }

    const result = await c.db
      .with(tableValues)
      .select({
        id: VwMeterSlice.id,
        name: VwMeterSlice.name,
        rate: VwMeterSlice.rate,
        isMain: VwMeterSlice.isMain,
        energyResource: VwMeterSlice.energyResource,
        meterId: VwMeterSlice.meterId,
        metric: {
          id: VwMeterSlice.metricId,
          name: VwMeterSlice.metricName,
          unitGroup: VwMeterSlice.metricUnitGroup,
        },
        department: {
          id: VwMeterSlice.departmentId,
          name: VwMeterSlice.departmentName,
        },
        // Not to group by all fields, consumption is subquery
        consumption: sql<number | null>`${c.db
          .select({
            consumption: sql<number | null>`sum(${tableValues.value})`,
          })
          .from(tableValues)
          .where(eq(tableValues.meterSliceId, VwMeterSlice.id))}`,
      })
      .from(VwMeterSlice)
      .where(and(...filters))
      // TODO need index somehow
      .orderBy(VwMeterSlice.name);

    if (query.noPercentage) {
      return result;
    }

    const mainConsumptions = await getMainConsumptions(c, {
      energyResource: query.energyResource,
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    return result.map((d) => {
      const consumption = mainConsumptions[d.energyResource];
      return {
        ...d,
        consumptionPercentage:
          !d.isMain && consumption && d.consumption
            ? (d.consumption / consumption) * 100
            : null,
      };
    });
  }

  export async function getNames(
    c: IContextOrg,
    query?: {
      ids?: string[];
      energyResource?: IEnergyResource;
      mainOnly?: boolean;
      nonMainOnly?: boolean;
    },
  ) {
    if (query?.ids?.length === 0) {
      return [];
    }

    const filters = [eq(VwMeterSlice.orgId, c.orgId)];

    if (query?.ids) {
      filters.push(inArray(VwMeterSlice.id, query.ids));
    }

    if (query?.energyResource) {
      filters.push(eq(VwMeterSlice.energyResource, query.energyResource));
    }

    if (query?.mainOnly) {
      filters.push(eq(VwMeterSlice.isMain, true));
    } else if (query?.nonMainOnly) {
      filters.push(eq(VwMeterSlice.isMain, false));
    }

    return await c.db
      .select({
        id: VwMeterSlice.id,
        name: VwMeterSlice.name,
        rate: VwMeterSlice.rate,
        energyResource: VwMeterSlice.energyResource,
        metricId: VwMeterSlice.metricId,
      })
      .from(VwMeterSlice)
      .where(and(...filters))
      .orderBy(VwMeterSlice.name);
  }

  // TODO remove this method
  export async function getEnergyResource(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        energyResource: TbMeter.energyResource,
      })
      .from(TbMeterSlice)
      .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
      .where(
        and(eq(TbMeterSlice.id, id), eq(TbMeterSlice.orgId, c.session.orgId)),
      );

    if (!record) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Meter slice record is not found for energy energyResource.",
      );
    }

    return record.energyResource;
  }

  export async function save(
    c: IContextUser,
    meterId: string,
    data: {
      id?: string;
      rate: number;
      departmentId: string;
      isMain: boolean;
    }[],
  ) {
    const sliceIdsToBeMain = data.flatMap((d) =>
      d.id && d.isMain ? [d.id] : [],
    );

    if (sliceIdsToBeMain.length > 0) {
      const [assignedSeuSlice] = await c.db
        .select({ id: TbSeuMeterSlice.id })
        .from(TbSeuMeterSlice)
        .where(
          and(
            eq(TbSeuMeterSlice.orgId, c.session.orgId),
            inArray(TbSeuMeterSlice.meterSliceId, sliceIdsToBeMain),
          ),
        )
        .limit(1);

      if (assignedSeuSlice) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "A meter slice directly assigned to an SEU cannot be set as main.",
        );
      }
    }
    const createdIds: string[] = [];
    const updatedIds: string[] = [];
    const deletedIds: string[] = [];

    await c.db.transaction(async (tx) => {
      const providedIds = data.filter((d) => d.id).map((d) => d.id!);

      let deletedRows: { id: string }[] = [];
      if (providedIds.length) {
        deletedRows = await tx
          .delete(TbMeterSlice)
          .where(
            and(
              eq(TbMeterSlice.orgId, c.session.orgId),
              eq(TbMeterSlice.subjectId, meterId),
              notInArray(TbMeterSlice.id, providedIds),
            ),
          )
          .returning({ id: TbMeterSlice.id });
      } else {
        deletedRows = await tx
          .delete(TbMeterSlice)
          .where(
            and(
              eq(TbMeterSlice.orgId, c.session.orgId),
              eq(TbMeterSlice.subjectId, meterId),
            ),
          )
          .returning({ id: TbMeterSlice.id });
      }
      deletedIds.push(...deletedRows.map((row) => row.id));

      const dataToInsert = data.filter((d) => !d.id);

      if (dataToInsert.length) {
        const insertedRows = await tx
          .insert(TbMeterSlice)
          .values(
            dataToInsert.map((d) => ({
              orgId: c.session.orgId,
              subjectId: meterId,
              departmentId: d.departmentId,
              rate: d.rate,
              isMain: d.isMain,
              createdAt: c.nowDatetime,
              createdBy: c.session.userId,
            })),
          )
          .returning({ id: TbMeterSlice.id });
        createdIds.push(...insertedRows.map((row) => row.id));
      }

      const dataToUpdate = data.filter((d) => d.id);

      for (const slice of dataToUpdate) {
        const updatedRow = await tx
          .update(TbMeterSlice)
          .set({
            departmentId: slice.departmentId,
            rate: slice.rate,
            isMain: slice.isMain,
          })
          .where(
            and(
              eq(TbMeterSlice.orgId, c.session.orgId),
              eq(TbMeterSlice.id, slice.id!),
              eq(TbMeterSlice.subjectId, meterId),
            ),
          )
          .returning({ id: TbMeterSlice.id });
        if (updatedRow.length > 0) {
          updatedIds.push(updatedRow[0].id);
        }
      }
    });

    return {
      createdIds,
      updatedIds,
      deletedIds,
    };
  }

  export async function getMainConsumptions(
    c: IContextOrg,
    query: {
      energyResource?: IEnergyResource;
      datetimeMin: string;
      datetimeMax: string;
    },
  ): Promise<Peomsal<Record<IEnergyResource, number>>> {
    const allMeters = await getAll(c, {
      noPercentage: true,
      energyResource: query.energyResource,
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    const resourceStats: Peomsal<
      Record<
        IEnergyResource,
        { hasMain: boolean; mainTotal: number; absoluteTotal: number }
      >
    > = {};

    for (const d of allMeters) {
      if (d.consumption === null) {
        continue;
      }

      if (!resourceStats[d.energyResource]) {
        resourceStats[d.energyResource] = {
          hasMain: false,
          mainTotal: 0,
          absoluteTotal: 0,
        };
      }

      const stat = resourceStats[d.energyResource]!;

      stat.absoluteTotal += d.consumption;

      if (d.isMain) {
        stat.hasMain = true;
        stat.mainTotal += d.consumption;
      }
    }

    const consumptions: Peomsal<Record<IEnergyResource, number>> = {};

    for (const resourceKey in resourceStats) {
      const resource = resourceKey as IEnergyResource;
      const stat = resourceStats[resource]!;
      consumptions[resource] = stat.hasMain
        ? stat.mainTotal
        : stat.absoluteTotal;
    }

    return consumptions;
  }

  export async function getMainConsumptionList(
    c: IContextOrg,
    query: {
      energyResource?: IEnergyResource;
      datetimeMin: string;
      datetimeMax: string;
    },
  ) {
    const mainConsumptions = await getMainConsumptions(c, query);
    return Object.entries(mainConsumptions).map(([energyResource, value]) => ({
      energyResource: energyResource as IEnergyResource,
      consumption: value,
    }));
  }

  export async function getGraphValues(
    c: IContextOrg,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      meterSliceIds: string[];
      period?: IMetricResourceValuePeriod;
    },
  ) {
    const period =
      query.period ||
      UtilMetricResourceValuePeriod.detectPeriod(
        query.datetimeMin,
        query.datetimeMax,
      );

    const slices = await getNames(c, { ids: query.meterSliceIds });

    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterSliceAgg(
        c,
        query.meterSliceIds,
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const values = await c.db
      .with(tableValues)
      .select({
        meterSliceId: tableValues.meterSliceId,
        value: sql<number>`${tableValues.value}`.as("value"),
        datetime: UtilDb.isoDatetime(tableValues.bucket),
      })
      .from(tableValues)
      .where(isNotNull(tableValues.value))
      .orderBy(tableValues.meterSliceId, tableValues.bucket);

    const series = slices.map((slice) => {
      const sliceValues = values
        .filter((v) => v.meterSliceId === slice.id)
        .map((v) => ({
          datetime: v.datetime,
          value: v.value,
        }));

      return {
        slice,
        values: sliceValues,
      };
    });

    return {
      period,
      series,
    };
  }
}
