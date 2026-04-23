import { EApiFailCode, IUnit, IUnitGroup, UtilUnit } from "common";
import {
  SQL,
  and,
  between,
  count,
  eq,
  ilike,
  inArray,
  isNotNull,
  ne,
  or,
  sql,
} from "drizzle-orm";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { UtilOrganization } from "@m/base/utils/UtilOrganization";
import { ApiException } from "@m/core/exceptions/ApiException";
import {
  IContextCore,
  IContextOrg,
  IContextUser,
} from "@m/core/interfaces/IContext";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { UtilContext } from "@m/core/utils/UtilContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { IMetricResource } from "../interfaces/IMetricResource";
import { IMetricResourceLabel } from "../interfaces/IMetricResourceLabel";
import { IMetricResourceValuePeriod } from "../interfaces/IMetricResourceValuePeriod";
import { IMetricType } from "../interfaces/IMetricType";
import { TbInboundIntegration } from "../orm/TbInboundIntegration";
import { TbMetric } from "../orm/TbMetric";
import { TbMetricIntegrationOutput } from "../orm/TbMetricIntegrationOutput";
import { TbMetricPartnerShared } from "../orm/TbMetricPartnerShared";
import { TbMetricResource } from "../orm/TbMetricResource";
import { TbMetricResourceLabel } from "../orm/TbMetricResourceLabel";
import { TbMetricResourceValueRaw } from "../orm/TbMetricResourceValueRaw";
import { TbOutboundIntegration } from "../orm/TbOutboundIntegration";
import { UtilMetricResourceLabel } from "../utils/UtilMetricResourceLabel";
import { UtilMetricResourceValuePeriod } from "../utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "../utils/UtilMetricValueQuery";

export namespace ServiceMetric {
  export async function checkOrgOwnership(c: IContextUser, ids: string[]) {
    await UtilOrganization.checkOwnership(c, ids, TbMetric);
  }

  export async function checkOrgOwnershipResource(
    c: IContextUser,
    resourceIds: string[],
  ) {
    await UtilOrganization.checkOwnership(c, resourceIds, TbMetricResource);
  }

  export async function refuseMetricUnitGroups(
    c: IContextUser,
    ids: string[],
    refusedUnitGroups: IUnitGroup[],
  ) {
    if (ids.length === 0) {
      return;
    }
    const metrics = await c.db
      .select({ unitGroup: TbMetric.unitGroup })
      .from(TbMetric)
      .where(and(inArray(TbMetric.id, ids), eq(TbMetric.orgId, c.orgId)));

    const hasRefusedUnit = metrics.some((m) =>
      refusedUnitGroups.includes(m.unitGroup),
    );

    if (hasRefusedUnit) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Metrics are not allowed for this operation.",
      );
    }
  }

  export async function checkOrgOwnershipResourceValue(
    c: IContextUser,
    resourceId: string,
    datetimes: string[],
  ) {
    if (!datetimes.length) {
      return;
    }

    const uniqueDatetimes = [...new Set(datetimes)];

    const [row] = await c.db
      .select({ count: count() })
      .from(TbMetricResourceValueRaw)
      .where(
        and(
          eq(TbMetricResourceValueRaw.orgId, c.session.orgId),
          eq(TbMetricResourceValueRaw.resourceId, resourceId),
          inArray(TbMetricResourceValueRaw.datetime, uniqueDatetimes),
        ),
      );

    if (row.count !== uniqueDatetimes.length) {
      throw new ApiException(
        EApiFailCode.FOREIGN_KEY_NOT_FOUND,
        "Records or record do not belong to organization or do not exist.",
      );
    }
  }

  export async function checkUnits(
    c: IContextUser,
    pairs: { id: string; unit: IUnit }[],
  ) {
    const metricIds = pairs.map((p) => p.id);
    const metrics = await c.db
      .select({ id: TbMetric.id, unitGroup: TbMetric.unitGroup })
      .from(TbMetric)
      .where(and(inArray(TbMetric.id, metricIds), eq(TbMetric.orgId, c.orgId)));

    const groupMap = new Map(metrics.map((m) => [m.id, m.unitGroup]));

    for (const { id, unit } of pairs) {
      const metricGroup = groupMap.get(id);

      const unitGroup = UtilUnit.getGroup(unit);
      if (unitGroup !== metricGroup) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Unit group mismatch.",
        );
      }
    }
  }

  export async function validateIsCounterByResource(
    c: IContextOrg,
    resourceIds: string[],
  ) {
    const [row] = await c.db
      .select({ id: TbMetric.id })
      .from(TbMetricResource)
      .innerJoin(TbMetric, eq(TbMetric.id, TbMetricResource.metricId))
      .where(
        and(
          eq(TbMetricResource.orgId, c.orgId),
          inArray(TbMetricResource.id, resourceIds),
          ne(TbMetric.type, "COUNTER"),
        ),
      )
      .limit(1);

    if (row) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Some metric resources are not counter.",
      );
    }
  }

  export async function getType(c: IContextOrg, id: string) {
    const [result] = await c.db
      .select({
        type: TbMetric.type,
      })
      .from(TbMetric)
      .where(and(eq(TbMetric.orgId, c.orgId), eq(TbMetric.id, id)));

    if (!result) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Metric record is not found for info.",
      );
    }

    return result.type;
  }

  // export async function getInfoByResourceId(
  //   c: IContextOrg,
  //   resourceId: string,
  // ) {
  //   const [result] = await c.db
  //     .select({
  //       metricId: TbMetric.id,
  //       type: TbMetric.type,
  //     })
  //     .from(TbMetricResource)
  //     .innerJoin(TbMetric, eq(TbMetric.id, TbMetricResource.metricId))
  //     .where(
  //       and(
  //         eq(TbMetricResource.orgId, c.orgId),
  //         eq(TbMetricResource.id, resourceId),
  //       ),
  //     );

  //   if (!result) {
  //     throw new ApiException(
  //       EApiFailCode.NOT_FOUND,
  //       "Metric record is not found for info.",
  //     );
  //   }

  //   return result;
  // }

  export async function getResourceValuesRaw(
    c: IContextOrg,
    resourceId: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      count: number;
      page: number;
    },
  ) {
    const filter = and(
      eq(TbMetricResourceValueRaw.orgId, c.orgId),
      eq(TbMetricResourceValueRaw.resourceId, resourceId),
      inArray(TbMetricResourceValueRaw.type, ["GAUGE", "COUNTER_CUMULATIVE"]),
      between(
        TbMetricResourceValueRaw.datetime,
        query.datetimeMin,
        query.datetimeMax,
      ),
    );

    const [recCount] = await c.db
      .select({ count: count() })
      .from(TbMetricResourceValueRaw)
      .where(filter);

    const records = await c.db
      .select({
        value: TbMetricResourceValueRaw.value,
        datetime: UtilDb.isoDatetime(TbMetricResourceValueRaw.datetime),
      })
      .from(TbMetricResourceValueRaw)
      .where(filter)
      .limit(query.count)
      .offset((query.page - 1) * query.count)
      .orderBy(TbMetricResourceValueRaw.datetime);

    return {
      recordCount: recCount.count,
      records: records.map((d) => ({ ...d, sampleCount: 1 })),
    };
  }

  // If subject type is METRIC, it aggregates all resources
  export async function getValues<TSkipInterpolatedValues extends boolean>(
    c: IContextOrg,
    subjectType: "METRIC" | "RESOURCE",
    subjectId: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      count: number;
      page: number;
      period: IMetricResourceValuePeriod | "RAW";
      skipInterpolatedValues?: TSkipInterpolatedValues;
    },
  ) {
    if (query.period === "RAW") {
      if (subjectType !== "RESOURCE") {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Cannot get raw values using non RESOURCE subject type",
        );
      }

      return getResourceValuesRaw(c, subjectId, query);
    }

    let queryUnion;
    const filters = [];

    if (subjectType === "RESOURCE") {
      queryUnion = UtilMetricValueQuery.genQueryInterpolatedUnionResource(
        c,
        [subjectId],
        query.period,
        [query.datetimeMin, query.datetimeMax],
      );
    } else {
      queryUnion = UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
        c,
        [subjectId],
        query.period,
        [query.datetimeMin, query.datetimeMax],
      );
    }

    filters.push(isNotNull(queryUnion.value));

    if (query.skipInterpolatedValues) {
      filters.push(isNotNull(queryUnion.valueCount));
    }

    const [recCount] = await c.db
      .with(queryUnion)
      .select({ count: count() })
      .from(queryUnion)
      .where(and(...filters));

    const records = await c.db
      .with(queryUnion)
      .select({
        // Null values are filtered at where section
        sampleCount: sql<
          TSkipInterpolatedValues extends true ? number : number | null
        >`${queryUnion.valueCount}`,
        // Null values are filtered at where section
        value: sql<number>`${queryUnion.value}`,
        datetime: UtilDb.isoDatetime(queryUnion.bucket),
      })
      .from(queryUnion)
      .limit(query.count)
      .offset((query.page - 1) * query.count)
      .where(and(...filters))
      .orderBy(queryUnion.bucket);

    return {
      recordCount: recCount.count,
      records,
    };
  }

  export async function getGraphValues(
    c: IContextOrg,
    metricId: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
      lowResolutionMode?: boolean;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
      query.lowResolutionMode,
    );

    const queryUnion = UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
      c,
      [metricId],
      period,
      [query.datetimeMin, query.datetimeMax],
    );

    const values = await c.db
      .with(queryUnion)
      .select({
        // Null values are filtered at where section
        value: sql<number>`${queryUnion.value}`,
        datetime: UtilDb.isoDatetime(queryUnion.bucket),
      })
      .from(queryUnion)
      .where(isNotNull(queryUnion.value))
      .orderBy(queryUnion.bucket);

    return {
      period,
      values,
    };
  }

  export async function getGraphResourceValues(
    c: IContextOrg,
    metricId: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const queryUnion = UtilMetricValueQuery.genQueryInterpolatedUnionMetric(
      c,
      [metricId],
      period,
      [query.datetimeMin, query.datetimeMax],
    );

    const values = await c.db
      .with(queryUnion)
      .select({
        resourceId: queryUnion.resourceId,
        // Null values are filtered at where section
        value: sql<number>`${queryUnion.value}`,
        datetime: UtilDb.isoDatetime(queryUnion.bucket),
      })
      .from(queryUnion)
      .where(isNotNull(queryUnion.value))
      .orderBy(queryUnion.resourceId, queryUnion.bucket);

    return {
      period,
      values,
    };
  }

  export async function getTotalCounterValueByMetricId(
    c: IContextOrg,
    metricIds: string[],
    period: IMetricResourceValuePeriod,
    datetimeRange: [string, string],
  ) {
    const tableCounterDeltaMetric =
      UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMetricAgg(
        c,
        metricIds,
        period,
        datetimeRange,
      );

    const records = await c.db
      .with(tableCounterDeltaMetric)
      .select({
        metricId: tableCounterDeltaMetric.metricId,
        // Null values are filtered at where section
        valueTotal: sql<number>`sum(${tableCounterDeltaMetric.value})`,
      })
      .from(tableCounterDeltaMetric)
      .where(isNotNull(tableCounterDeltaMetric.value))
      .groupBy(tableCounterDeltaMetric.metricId);

    const recordsByMetricId: Record<string, number> = {};
    for (const d of records) {
      recordsByMetricId[d.metricId] =
        (recordsByMetricId[d.metricId] || 0) + d.valueTotal;
    }
    return recordsByMetricId;
  }

  export async function addValues(
    c: IContextCore,
    orgId: string,
    metricId: string,
    unit: IUnit,
    values: ITimedValue[],
    labels: IMetricResourceLabel[],
  ) {
    if (!values.length) {
      throw new ApiException(EApiFailCode.BAD_REQUEST, "No value is given");
    }

    return await c.db.transaction(async (tx) => {
      const [recMetric] = await tx
        .select({
          type: TbMetric.type,
          unitGroup: TbMetric.unitGroup,
          lastValueDatetime: UtilDb.isoDatetime(TbMetric.lastValueDatetime),
        })
        .from(TbMetric)
        .where(and(eq(TbMetric.orgId, orgId), eq(TbMetric.id, metricId)));

      if (!recMetric) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Metric record is not found to feed values.",
        );
      }

      const unitGroup = UtilUnit.getGroup(unit);

      if (unitGroup !== recMetric.unitGroup) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Metric unit group does not match the value unit.",
        );
      }

      // Convert values respect to unit
      const multiplier = UtilUnit.getBaseMultiplier(unit);
      const convertedValues =
        // Micro optimization
        multiplier === 1
          ? values
          : values.map((d) => ({
              datetime: d.datetime,
              value: d.value * multiplier,
            }));

      const resourceId = await findOrCreateResource(
        UtilContext.overwriteDb(c, tx),
        orgId,
        metricId,
        labels,
      );

      // Check if there is any older value
      const type =
        recMetric.type === "GAUGE"
          ? ("GAUGE" as const)
          : ("COUNTER_CUMULATIVE" as const);

      // Save values
      const resultInsert = await tx
        .insert(TbMetricResourceValueRaw)
        .values(
          convertedValues.map((d) => ({
            orgId,
            type,
            resourceId,
            datetime: d.datetime,
            value: d.value,
          })),
        )
        .onConflictDoUpdate({
          target: [
            TbMetricResourceValueRaw.orgId,
            TbMetricResourceValueRaw.type,
            TbMetricResourceValueRaw.resourceId,
            TbMetricResourceValueRaw.datetime,
          ],
          set: {
            value: sql`excluded.value`,
          },
        });

      // Find latest value for loggin purposes
      let latestValue = convertedValues[0];
      let latestDate = new Date(latestValue.datetime);
      for (let i = 1; i < convertedValues.length; ++i) {
        const value = convertedValues[i];
        const date = new Date(value.datetime);
        if (date > latestDate) {
          latestValue = value;
          latestDate = date;
        }
      }

      await tx
        .update(TbMetric)
        .set({
          lastValue: latestValue.value,
          lastValueDatetime: latestValue.datetime,
          valuesUpdatedAt: c.nowDatetime,
        })
        .where(eq(TbMetric.id, metricId));

      c.logger.info(
        {
          metricId,
          countInserted: UtilDb.getAffectedRows(resultInsert),
        },
        "Metric records are added.",
      );

      return resourceId;
    });
  }

  export async function getNames(
    c: IContextOrg,
    options?: {
      search?: string;
      ids?: string[];
    },
  ) {
    const filters: SQL[] = [eq(TbMetric.orgId, c.orgId)];
    if (options?.ids) {
      filters.push(inArray(TbMetric.id, options.ids));
    }
    if (options?.search) {
      filters.push(ilike(TbMetric.name, `%${options.search}%`));
    }

    const metricNames = await c.db
      .select({
        id: TbMetric.id,
        name: TbMetric.name,
        type: TbMetric.type,
        unitGroup: TbMetric.unitGroup,
      })
      .from(TbMetric)
      .where(and(...filters))
      .orderBy(TbMetric.name);

    // Special check for metric id filter
    if (
      options?.ids &&
      metricNames.length !== [...new Set(options.ids)].length
    ) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Given metric ids are not found.",
      );
    }

    return metricNames;
  }

  export async function getAll(
    c: IContextOrg,
    options?: { ids?: string[]; partnerId?: string },
  ) {
    const filters: (SQL | undefined)[] = [];

    if (options?.ids) {
      if (options.ids.length === 0) {
        return [];
      }
      filters.push(inArray(TbMetric.id, options.ids));
    }

    if (options?.partnerId) {
      if (options.partnerId === c.orgId) {
        filters.push(eq(TbMetric.orgId, c.orgId));
      } else {
        filters.push(eq(TbMetric.orgId, options.partnerId));
        filters.push(eq(TbMetricPartnerShared.partnerId, c.orgId));
      }
    } else {
      filters.push(
        or(
          eq(TbMetric.orgId, c.orgId),
          eq(TbMetricPartnerShared.partnerId, c.orgId),
        ),
      );
    }

    return c.db
      .select({
        id: TbMetric.id,
        org: { id: TbOrganization.id, displayName: TbOrganization.displayName },
        name: TbMetric.name,
        description: TbMetric.description,
        type: TbMetric.type,
        unitGroup: TbMetric.unitGroup,
        lastValue: TbMetric.lastValue,
        lastValueDatetime: UtilDb.isoDatetime(TbMetric.lastValueDatetime),
        valuesUpdatedAt: UtilDb.isoDatetime(TbMetric.valuesUpdatedAt),
        outboundIntegration: {
          id: TbOutboundIntegration.id,
          period: TbOutboundIntegration.period,
          type: TbOutboundIntegration.type,
        },
        inboundIntegration: {
          id: TbInboundIntegration.id,
          type: TbInboundIntegration.type,
        },
      })
      .from(TbMetric)
      .innerJoin(TbOrganization, eq(TbOrganization.id, TbMetric.orgId))
      .leftJoin(
        TbMetricIntegrationOutput,
        eq(TbMetricIntegrationOutput.metricId, TbMetric.id),
      )
      .leftJoin(
        TbOutboundIntegration,
        eq(
          TbOutboundIntegration.id,
          TbMetricIntegrationOutput.outboundIntegrationId,
        ),
      )
      .leftJoin(
        TbInboundIntegration,
        eq(
          TbInboundIntegration.id,
          TbMetricIntegrationOutput.inboundIntegrationId,
        ),
      )
      .leftJoin(
        TbMetricPartnerShared,
        and(
          eq(TbMetricPartnerShared.subjectId, TbMetric.id),
          eq(TbMetricPartnerShared.partnerId, c.orgId),
        ),
      )
      .where(and(...filters))
      .orderBy(TbMetric.name);
  }

  export async function get(c: IContextOrg, id: string) {
    const [record] = await c.db
      .select({
        id: TbMetric.id,
        name: TbMetric.name,
        description: TbMetric.description,
        type: TbMetric.type,
        unitGroup: TbMetric.unitGroup,
        lastValue: TbMetric.lastValue,
        lastValueDatetime: UtilDb.isoDatetime(TbMetric.lastValueDatetime),
        valuesUpdatedAt: UtilDb.isoDatetime(TbMetric.valuesUpdatedAt),
        outboundIntegration: {
          id: TbOutboundIntegration.id,
          period: TbOutboundIntegration.period,
          type: TbOutboundIntegration.type,
        },
        inboundIntegration: {
          id: TbInboundIntegration.id,
          type: TbInboundIntegration.type,
        },
      })
      .from(TbMetric)
      .leftJoin(
        TbMetricIntegrationOutput,
        eq(TbMetricIntegrationOutput.metricId, TbMetric.id),
      )
      .leftJoin(
        TbOutboundIntegration,
        eq(
          TbOutboundIntegration.id,
          TbMetricIntegrationOutput.outboundIntegrationId,
        ),
      )
      .leftJoin(
        TbInboundIntegration,
        eq(
          TbInboundIntegration.id,
          TbMetricIntegrationOutput.inboundIntegrationId,
        ),
      )
      .where(and(eq(TbMetric.orgId, c.orgId), eq(TbMetric.id, id)));

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function getLabels(c: IContextUser, metricId?: string) {
    const filters: SQL[] = [eq(TbMetricResourceLabel.orgId, c.orgId)];

    if (metricId) {
      filters.push(eq(TbMetricResource.metricId, metricId));
    }

    const records = await c.db
      .select({
        type: TbMetricResourceLabel.type,
        key: TbMetricResourceLabel.key,
        value: TbMetricResourceLabel.value,
      })
      .from(TbMetricResourceLabel)
      .where(and(...filters))
      .innerJoin(
        TbMetricResource,
        eq(TbMetricResource.id, TbMetricResourceLabel.resourceId),
      )
      .groupBy(
        TbMetricResourceLabel.type,
        TbMetricResourceLabel.key,
        TbMetricResourceLabel.value,
      )
      .orderBy(
        TbMetricResourceLabel.type,
        TbMetricResourceLabel.key,
        TbMetricResourceLabel.value,
      );

    return records as IMetricResourceLabel[];
  }

  export async function create(
    c: IContextUser,
    data: {
      name: string;
      description: string | null;
      type: IMetricType;
      unitGroup: IUnitGroup;
    },
  ) {
    if (
      data.type === "COUNTER" &&
      !UtilUnit.getCounterUnitGroups().includes(data.unitGroup)
    ) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Unit group and metric type is not matched.",
      );
    }

    const [record] = await c.db
      .insert(TbMetric)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        name: data.name,
        description: data.description,
        type: data.type,
        unitGroup: data.unitGroup,
      })
      .returning({ id: TbMetric.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      name: string;
      description: string | null;
    },
  ) {
    const result = await c.db
      .update(TbMetric)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(and(eq(TbMetric.orgId, c.session.orgId), eq(TbMetric.id, id)));

    if (!UtilDb.getAffectedRows(result)) {
      throw new ApiException(EApiFailCode.BAD_REQUEST);
    }
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db.transaction(async (tx) => {
      const resources = await tx
        .delete(TbMetricResource)
        .where(
          and(
            eq(TbMetricResource.orgId, c.session.orgId),
            eq(TbMetricResource.metricId, id),
          ),
        )
        .returning({ id: TbMetricResource.id });

      const resourceIds = resources.map((d) => d.id);

      if (resourceIds.length) {
        await tx
          .delete(TbMetricResourceLabel)
          .where(
            and(
              eq(TbMetricResourceLabel.orgId, c.session.orgId),
              inArray(TbMetricResourceLabel.resourceId, resourceIds),
            ),
          );

        await tx
          .delete(TbMetricResourceValueRaw)
          .where(
            and(
              eq(TbMetricResourceValueRaw.orgId, c.session.orgId),
              inArray(TbMetricResourceValueRaw.resourceId, resourceIds),
            ),
          );
      }

      const rec = await tx
        .delete(TbMetric)
        .where(and(eq(TbMetric.orgId, c.session.orgId), eq(TbMetric.id, id)));

      if (!UtilDb.getAffectedRows(rec)) {
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Metric not found or already deleted.",
        );
      }
    });
  }

  export async function deleteValues(
    c: IContextUser,
    resourceId: string,
    datetimes: string[],
  ) {
    const rec = await c.db
      .delete(TbMetricResourceValueRaw)
      .where(
        and(
          eq(TbMetricResourceValueRaw.orgId, c.session.orgId),
          eq(TbMetricResourceValueRaw.resourceId, resourceId),
          inArray(TbMetricResourceValueRaw.datetime, datetimes),
        ),
      );

    if (!UtilDb.getAffectedRows(rec)) {
      throw new ApiException(
        EApiFailCode.NOT_FOUND,
        "Metric value(s) not found or already deleted.",
      );
    }
  }

  export async function findOrCreateResource(
    c: IContextCore,
    orgId: string,
    metricId: string,
    labels: IMetricResourceLabel[],
  ) {
    const hash = await UtilMetricResourceLabel.hash(labels);

    const [res] = await c.db
      .select({
        id: TbMetricResource.id,
        // These are for collision check
        labels: UtilDb.jsonAgg({
          type: TbMetricResourceLabel.type,
          key: TbMetricResourceLabel.key,
          value: TbMetricResourceLabel.value,
        }),
      })
      .from(TbMetricResource)
      .innerJoin(
        TbMetricResourceLabel,
        eq(TbMetricResourceLabel.resourceId, TbMetricResource.id),
      )
      .where(
        and(
          eq(TbMetricResource.orgId, orgId),
          eq(TbMetricResource.metricId, metricId),
          eq(TbMetricResource.hash, hash),
        ),
      )
      .groupBy(TbMetricResource.id);

    // Existing
    if (res) {
      // Collision check
      const canonicalA = UtilMetricResourceLabel.canonicalize(
        res.labels as IMetricResourceLabel[],
      );
      const canonicalB = UtilMetricResourceLabel.canonicalize(labels);
      if (canonicalA !== canonicalB) {
        throw new ApiException(
          EApiFailCode.INTERNAL,
          `Label hash collision detected. ${canonicalA} != ${canonicalB}`,
        );
      }

      return res.id;
    }

    // First time seen
    const [newResource] = await c.db
      .insert(TbMetricResource)
      .values({
        orgId,
        metricId,
        hash,
      })
      .returning({ id: TbMetricResource.id });

    await c.db.insert(TbMetricResourceLabel).values(
      labels.map((d) => ({
        orgId,
        resourceId: newResource.id,
        ...d,
      })),
    );

    return newResource.id;
  }

  export async function getResources(
    c: IContextOrg,
    options?: { metricId?: string; resourceIds?: string[] },
  ) {
    const filters = [eq(TbMetricResource.orgId, c.orgId)];

    if (options?.metricId) {
      filters.push(eq(TbMetricResource.metricId, options?.metricId));
    }
    if (options?.resourceIds) {
      if (!options.resourceIds.length) {
        return [];
      }
      filters.push(inArray(TbMetricResource.id, options?.resourceIds));
    }

    const records = await c.db
      .select({
        metric: {
          id: TbMetric.id,
          name: TbMetric.name,
          type: TbMetric.type,
          unitGroup: TbMetric.unitGroup,
        },
        id: TbMetricResource.id,
        labels: UtilDb.jsonAgg(
          {
            type: TbMetricResourceLabel.type,
            key: TbMetricResourceLabel.key,
            value: TbMetricResourceLabel.value,
          },
          {
            orderBy: [
              TbMetricResourceLabel.type,
              TbMetricResourceLabel.key,
              TbMetricResourceLabel.value,
            ],
          },
        ),
      })
      .from(TbMetricResource)
      .innerJoin(
        TbMetricResourceLabel,
        and(
          eq(TbMetricResourceLabel.orgId, TbMetricResource.orgId),
          eq(TbMetricResourceLabel.resourceId, TbMetricResource.id),
        ),
      )
      .innerJoin(TbMetric, eq(TbMetric.id, TbMetricResource.metricId))
      .where(and(...filters))
      .orderBy(TbMetric.name, TbMetricResource.hash)
      .groupBy(TbMetric.id, TbMetricResource.id);

    // Type cast is only for labels type
    return records as IMetricResource[];
  }

  export async function shareWithPartners(
    c: IContextOrg,
    id: string,
    partnerIds: string[],
  ) {
    await c.db.transaction(async (tx) => {
      await tx
        .delete(TbMetricPartnerShared)
        .where(
          and(
            eq(TbMetricPartnerShared.orgId, c.orgId),
            eq(TbMetricPartnerShared.subjectId, id),
          ),
        );

      for (const pi of partnerIds) {
        await tx
          .insert(TbMetricPartnerShared)
          .values({ subjectId: id, orgId: c.orgId, partnerId: pi });
      }
    });
  }

  export async function getSharedPartners(c: IContextOrg, id: string) {
    return await c.db
      .select({
        id: TbMetricPartnerShared.partnerId,
        displayName: TbOrganization.displayName,
      })
      .from(TbMetricPartnerShared)
      .where(
        and(
          eq(TbMetricPartnerShared.subjectId, id),
          eq(TbMetricPartnerShared.orgId, c.orgId),
        ),
      )
      .innerJoin(
        TbOrganization,
        eq(TbMetricPartnerShared.partnerId, TbOrganization.id),
      );
  }

  export async function getSharedMetrics(c: IContextOrg) {
    return await c.db
      .select({
        id: TbMetricPartnerShared.subjectId,
        name: TbMetric.name,
      })
      .from(TbMetricPartnerShared)
      .where(eq(TbMetricPartnerShared.orgId, c.orgId))
      .innerJoin(TbMetric, eq(TbMetricPartnerShared.subjectId, TbMetric.id));
  }

  export async function removeSharedMetric(c: IContextOrg, id: string) {
    await c.db
      .delete(TbMetricPartnerShared)
      .where(
        and(
          eq(TbMetricPartnerShared.partnerId, c.orgId),
          eq(TbMetricPartnerShared.subjectId, id),
        ),
      );
  }
}
