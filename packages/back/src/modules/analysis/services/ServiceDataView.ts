import { EApiFailCode, IUnitGroup } from "common";
import { and, eq, isNotNull, sql } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { UtilDb } from "@m/core/utils/UtilDb";

import { TbDataViewProfile } from "../orm/TbDataViewProfile";
import { TbDataViewProfileMeterSlice } from "../orm/TbDataViewProfileMeterSlice";
import { TbDataViewProfileMetric } from "../orm/TbDataViewProfileMetric";
import { TbDataViewProfileSeu } from "../orm/TbDataViewProfileSeu";
import { TbMetric } from "../../measurement/orm/TbMetric";
import { TbSeu } from "../../measurement/orm/TbSeu";
import { VwMeterSlice } from "../../measurement/orm/VwMeterSlice";
import { UtilMetricResourceValuePeriod } from "../../measurement/utils/UtilMetricResourceValuePeriod";
import { UtilMetricValueQuery } from "../../measurement/utils/UtilMetricValueQuery";

export namespace ServiceDataView {
  export async function getValues(
    c: IContextUser,
    profileId: string,
    query: {
      datetimeMin: string;
      datetimeMax: string;
    },
  ) {
    const period = UtilMetricResourceValuePeriod.detectPeriod(
      query.datetimeMin,
      query.datetimeMax,
    );

    const [profile] = await c.db
      .select({
        id: TbDataViewProfile.id,
        name: TbDataViewProfile.name,
        viewType: TbDataViewProfile.viewType,
      })
      .from(TbDataViewProfile)
      .where(
        and(
          eq(TbDataViewProfile.id, profileId),
          eq(TbDataViewProfile.orgId, c.session.orgId),
        ),
      );

    if (!profile) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }

    let series: {
      id: string;
      name: string;
      unit: IUnitGroup;
      values: Array<{ value: number; datetime: string }>;
    }[] = [];

    switch (profile.viewType) {
      case "METRIC": {
        const items = await c.db
          .select({
            id: TbMetric.id,
            name: TbMetric.name,
            unit: TbMetric.unitGroup,
          })
          .from(TbDataViewProfileMetric)
          .innerJoin(
            TbMetric,
            eq(TbMetric.id, TbDataViewProfileMetric.metricId),
          )
          .where(
            and(
              eq(TbDataViewProfileMetric.orgId, c.session.orgId),
              eq(TbDataViewProfileMetric.subjectId, profileId),
            ),
          )
          .orderBy(TbMetric.name);

        const itemIds = items.map((metric) => metric.id);

        const tableValues =
          UtilMetricValueQuery.genQueryInterpolatedUnionMetricAgg(
            c,
            itemIds,
            period,
            [query.datetimeMin, query.datetimeMax],
          );

        const values = await c.db
          .with(tableValues)
          .select({
            itemId: tableValues.metricId,
            // Null values are filtered at where section
            value: sql<number>`${tableValues.value}`,
            datetime: UtilDb.isoDatetime(tableValues.bucket),
          })
          .from(tableValues)
          .where(isNotNull(tableValues.value))
          .orderBy(tableValues.metricId, tableValues.bucket);

        series = items.map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit,
          values: values
            .filter((d) => d.itemId === item.id)
            .map((d) => ({
              value: d.value,
              datetime: d.datetime,
            })),
        }));
        break;
      }

      case "METER_SLICE": {
        const items = await c.db
          .select({
            id: VwMeterSlice.id,
            name: VwMeterSlice.name,
          })
          .from(TbDataViewProfileMeterSlice)
          .innerJoin(
            VwMeterSlice,
            and(
              eq(VwMeterSlice.id, TbDataViewProfileMeterSlice.meterSliceId),
              eq(VwMeterSlice.orgId, c.session.orgId),
            ),
          )
          .where(
            and(
              eq(TbDataViewProfileMeterSlice.subjectId, profileId),
              eq(TbDataViewProfileMeterSlice.orgId, c.session.orgId),
            ),
          )
          .orderBy(VwMeterSlice.name);

        const itemIds = items.map((item) => item.id);

        const tableValues =
          UtilMetricValueQuery.genQueryInterpolatedCounterDeltaMeterSliceAgg(
            c,
            itemIds,
            period,
            [query.datetimeMin, query.datetimeMax],
          );

        const values = await c.db
          .with(tableValues)
          .select({
            itemId: tableValues.meterSliceId,
            // Null values are filtered at where section
            value: sql<number>`${tableValues.value}`,
            datetime: UtilDb.isoDatetime(tableValues.bucket),
          })
          .from(tableValues)
          .where(isNotNull(tableValues.value))
          .orderBy(tableValues.meterSliceId, tableValues.bucket);

        series = items.map((item) => ({
          id: item.id,
          name: item.name,
          unit: "ENERGY" as const,
          values: values
            .filter((d) => d.itemId === item.id)
            .map((d) => ({
              value: d.value,
              datetime: d.datetime,
            })),
        }));

        break;
      }

      case "SEU": {
        const items = await c.db
          .select({
            id: TbSeu.id,
            name: TbSeu.name,
          })
          .from(TbDataViewProfileSeu)
          .innerJoin(
            TbSeu,
            and(
              eq(TbSeu.id, TbDataViewProfileSeu.seuId),
              eq(TbSeu.orgId, c.session.orgId),
            ),
          )
          .where(
            and(
              eq(TbDataViewProfileSeu.subjectId, profileId),
              eq(TbDataViewProfileSeu.orgId, c.session.orgId),
            ),
          )
          .orderBy(TbSeu.name);

        const itemIds = items.map((item) => item.id);

        const tableValues =
          UtilMetricValueQuery.genQueryInterpolatedCounterDeltaSeuAgg(
            c,
            itemIds,
            period,
            [query.datetimeMin, query.datetimeMax],
          );

        const values = await c.db
          .with(tableValues)
          .select({
            itemId: tableValues.seuId,
            // Null values are filtered at where section
            value: sql<number>`${tableValues.value}`.as("value"),
            datetime: UtilDb.isoDatetime(tableValues.bucket),
          })
          .from(tableValues)
          .where(isNotNull(tableValues.value))
          .orderBy(tableValues.seuId, tableValues.bucket);

        series = items.map((item) => ({
          id: item.id,
          name: item.name,
          unit: "ENERGY" as const,
          values: values
            .filter((d) => d.itemId === item.id && d.value !== null)
            .map((d) => ({
              value: d.value!,
              datetime: d.datetime,
            })),
        }));
        break;
      }

      default:
        throw new ApiException(
          EApiFailCode.NOT_FOUND,
          "Invalid metric view profile type.",
        );
    }

    return {
      period,
      series,
    };
  }

  export async function getNames(c: IContextUser) {
    return await c.db
      .select({
        id: TbDataViewProfile.id,
        name: TbDataViewProfile.name,
      })
      .from(TbDataViewProfile)
      .where(and(eq(TbDataViewProfile.orgId, c.session.orgId)))
      .orderBy(TbDataViewProfile.createdAt);
  }
}
