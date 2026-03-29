import { EApiFailCode } from "common";
import { SQL, and, eq, sql } from "drizzle-orm";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbDepartment } from "@m/base/orm/TbDepartment";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextOrg, IContextUser } from "@m/core/interfaces/IContext";
import { UtilContext } from "@m/core/utils/UtilContext";

import { TbMeter } from "../orm/TbMeter";
import { TbMeterSlice } from "../orm/TbMeterSlice";
import { TbMetric } from "../orm/TbMetric";
import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "../utils/UtilMetricValueQuery";
import { ServiceMeterSlice } from "./ServiceMeterSlice";
import { ServiceMetric } from "./ServiceMetric";

export namespace ServiceMeter {
  export async function getAll(
    c: IContextUser,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      energyResource?: IEnergyResource;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const meterFilters: (SQL | undefined)[] = [eq(TbMeter.orgId, c.orgId)];

    if (query.energyResource) {
      meterFilters.push(eq(TbMeter.energyResource, query.energyResource));
    }

    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterAgg(
        c,
        undefined,
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const records = await c.db
      .with(tableValues)
      .select({
        id: TbMeter.id,
        name: TbMeter.name,
        energyResource: TbMeter.energyResource,
        energyConversionRate: TbMeter.energyConversionRate,
        metric: {
          id: TbMetric.id,
          name: TbMetric.name,
          unitGroup: TbMetric.unitGroup,
        },
        // Not to group by all fields, consumption is subquery
        consumption: sql<number | null>`${c.db
          .select({
            consumption: sql<number | null>`sum(${tableValues.value})`,
          })
          .from(tableValues)
          .where(eq(tableValues.meterId, TbMeter.id))}`,
      })
      .from(TbMeter)
      .innerJoin(TbMetric, eq(TbMetric.id, TbMeter.metricId))
      .where(and(...meterFilters))
      .orderBy(TbMeter.energyResource, TbMeter.name);

    const recordSlices = await c.db
      .select({
        id: TbMeterSlice.id,
        meterId: TbMeterSlice.subjectId,
        rate: TbMeterSlice.rate,
        isMain: TbMeterSlice.isMain,
        department: {
          id: TbMeterSlice.departmentId,
          name: TbDepartment.name,
        },
      })
      .from(TbMeterSlice)
      .innerJoin(TbDepartment, eq(TbDepartment.id, TbMeterSlice.departmentId))
      .where(eq(TbMeterSlice.orgId, c.session.orgId));

    const mainConsumptions = await ServiceMeterSlice.getMainConsumptions(c, {
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    return records.map((d) => {
      const slices = recordSlices.filter((s) => s.meterId === d.id);
      const hasMainMeterSlice = slices.some((s) => s.isMain);
      const mainConsumption = mainConsumptions[d.energyResource] || null;
      return {
        ...d,
        consumptionPercentage:
          !hasMainMeterSlice && mainConsumption && d.consumption
            ? (d.consumption / mainConsumption) * 100
            : null,
        slices: recordSlices
          .filter((s) => s.meterId === d.id)
          // It is mapped to omit `meterId` field
          .map((s) => ({
            id: s.id,
            rate: s.rate,
            isMain: s.isMain,
            department: s.department,
          })),
      };
    });
  }

  export async function getNames(c: IContextOrg) {
    return c.db
      .select({
        id: TbMeter.id,
        name: TbMeter.name,
        energyResource: TbMeter.energyResource,
      })
      .from(TbMeter)
      .where(and(eq(TbMeter.orgId, c.orgId)))
      .orderBy(TbMeter.name);
  }

  export async function get(
    c: IContextUser,
    id: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const tableValues =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterAgg(
        c,
        [id],
        period,
        [query.datetimeMin, query.datetimeMax],
      );

    const [record] = await c.db
      .with(tableValues)
      .select({
        id: TbMeter.id,
        name: TbMeter.name,
        energyResource: TbMeter.energyResource,
        energyConversionRate: TbMeter.energyConversionRate,
        metric: {
          id: TbMetric.id,
          name: TbMetric.name,
          unitGroup: TbMetric.unitGroup,
        },
        // Not to group by all fields, consumption is subquery
        consumption: sql<number | null>`${c.db
          .select({
            consumption: sql<number | null>`sum(${tableValues.value})`,
          })
          // No need where section, it is already filtered
          .from(tableValues)}`,
      })
      .from(TbMeter)
      .innerJoin(TbMetric, eq(TbMetric.id, TbMeter.metricId))
      .where(and(eq(TbMeter.orgId, c.session.orgId), eq(TbMeter.id, id)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    const recordSlices = await c.db
      .select({
        id: TbMeterSlice.id,
        rate: TbMeterSlice.rate,
        isMain: TbMeterSlice.isMain,
        department: {
          id: TbMeterSlice.departmentId,
          name: TbDepartment.name,
        },
      })
      .from(TbMeterSlice)
      .innerJoin(TbDepartment, eq(TbDepartment.id, TbMeterSlice.departmentId))
      .where(
        and(
          eq(TbMeterSlice.orgId, c.session.orgId),
          eq(TbMeterSlice.subjectId, id),
        ),
      );

    const mainConsumptions = await ServiceMeterSlice.getMainConsumptions(c, {
      datetimeMin: query.datetimeMin,
      datetimeMax: query.datetimeMax,
    });

    const hasMainMeterSlice = recordSlices.some((slice) => slice.isMain);
    const mainConsumption = mainConsumptions[record.energyResource] || null;

    return {
      ...record,
      consumptionPercentage:
        !hasMainMeterSlice && mainConsumption && record.consumption
          ? (record.consumption / mainConsumption) * 100
          : null,
      slices: recordSlices,
    };
  }

  export async function checkMetricEnergyResourceCompatibility(
    c: IContextUser,
    metricId: string,
    energyResource: IEnergyResource,
  ) {
    const [res] = await c.db
      .select({ unitGroup: TbMetric.unitGroup })
      .from(TbMetric)
      .where(
        and(eq(TbMetric.orgId, c.session.orgId), eq(TbMetric.id, metricId)),
      );

    switch (energyResource) {
      case "ELECTRIC":
        if (res.unitGroup !== "ENERGY") {
          throw new ApiException(
            EApiFailCode.BAD_REQUEST,
            "ELECTRIC resource must use ENERGY unit group",
          );
        }
        break;

      case "GAS":
      case "DIESEL":
      case "SOLID_FUEL":
      case "WATER":
        if (!["ENERGY", "WEIGHT", "VOLUME"].includes(res.unitGroup)) {
          throw new ApiException(
            EApiFailCode.BAD_REQUEST,
            "Resource must use ENERGY, WEIGHT, or VOLUME unit group",
          );
        }
        break;
      default:
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Unsupported energy resource",
        );
    }
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      energyResource: IEnergyResource;
      metricId: string;
      departmentId: string;
      energyConversionRate: number;
      isMain: boolean;
    },
  ) {
    return await c.db.transaction(async (tx) => {
      const cTx = UtilContext.overwriteDb(c, tx);

      const type = await ServiceMetric.getType(cTx, data.metricId);
      if (type !== "COUNTER") {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Meter cannot use a non counter metric.",
        );
      }

      const [res] = await tx
        .insert(TbMeter)
        .values({
          orgId: c.session.orgId,
          createdBy: c.session.userId,
          createdAt: c.nowDatetime,
          name: data.name,
          energyResource: data.energyResource,
          metricId: data.metricId,
          energyConversionRate: data.energyConversionRate,
        })
        .returning({ id: TbMeter.id });

      const slice = await ServiceMeterSlice.save(cTx, res.id, [
        {
          rate: 1,
          departmentId: data.departmentId,
          isMain: data.isMain,
        },
      ]);

      return { id: res.id, sliceId: slice.createdIds[0] };
    });
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      energyResource: IEnergyResource;
      energyConversionRate: number;
      metricId: string;
    },
  ) {
    await c.db.transaction(async (tx) => {
      const cTx = UtilContext.overwriteDb(c, tx);

      const type = await ServiceMetric.getType(cTx, data.metricId);
      if (type !== "COUNTER") {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Meter cannot use a non counter metric.",
        );
      }

      await tx
        .update(TbMeter)
        .set({
          name: data.name,
          energyResource: data.energyResource,
          energyConversionRate: data.energyConversionRate,
          metricId: data.metricId,
        })
        .where(eq(TbMeter.id, id));
    });
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbMeterSlice)
        .where(
          and(
            eq(TbMeterSlice.orgId, c.session.orgId),
            eq(TbMeterSlice.subjectId, id),
          ),
        );

      await tx
        .delete(TbMeter)
        .where(and(eq(TbMeter.orgId, c.session.orgId), eq(TbMeter.id, id)));
    });
  }
}
