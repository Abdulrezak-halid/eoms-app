import { EApiFailCode, IUnit } from "common";
import { SQL, and, eq, gte, lte, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { IPeriod } from "@m/commitment/interfaces/IPeriod";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextCore, IContextUser } from "@m/core/interfaces/IContext";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { TbCriticalOperationalParameter } from "../orm/TbCriticalOperationalParameter";

export namespace ServiceCriticalOperationalParameter {
  export async function getAll(
    c: IContextCore,
    orgId: string,
    options?: { datetimeMin?: string; datetimeMax?: string },
  ) {
    const aliasUserValue = alias(TbUser, "uv");
    const aliasUserDeviation = alias(TbUser, "ud");

    const filters: (SQL | undefined)[] = [
      eq(TbCriticalOperationalParameter.orgId, orgId),
    ];

    if (options?.datetimeMin || options?.datetimeMax) {
      const filter1 = [];
      const filter2 = [];

      if (options?.datetimeMin) {
        filter1.push(
          gte(TbCriticalOperationalParameter.createdAt, options.datetimeMin),
          gte(TbCriticalOperationalParameter.controlDate, options.datetimeMin),
        );
      }
      if (options?.datetimeMax) {
        filter2.push(
          lte(TbCriticalOperationalParameter.createdAt, options.datetimeMax),
          lte(TbCriticalOperationalParameter.controlDate, options.datetimeMax),
        );
      }

      filters.push(or(and(...filter1), and(...filter2)));
    }

    return await c.db
      .select({
        id: TbCriticalOperationalParameter.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        energyResource: TbCriticalOperationalParameter.energyResource,
        parameter: TbCriticalOperationalParameter.parameter,
        period: TbCriticalOperationalParameter.period,
        unit: TbCriticalOperationalParameter.unit,
        normalSettingValue: TbCriticalOperationalParameter.normalSettingValue,
        lowerLimit: TbCriticalOperationalParameter.lowerLimit,
        upperLimit: TbCriticalOperationalParameter.upperLimit,
        accuracyCalibrationFrequency:
          TbCriticalOperationalParameter.accuracyCalibrationFrequency,
        measurementTool: TbCriticalOperationalParameter.measurementTool,
        valueResponsibleUser: {
          id: aliasUserValue.id,
          displayName: sqlUserDisplayName(aliasUserValue),
        },
        deviationResponsibleUser: {
          id: aliasUserDeviation.id,
          displayName: sqlUserDisplayName(aliasUserDeviation),
        },
        note: TbCriticalOperationalParameter.note,
        controlDate: TbCriticalOperationalParameter.controlDate,
      })
      .from(TbCriticalOperationalParameter)
      .innerJoin(TbSeu, eq(TbSeu.id, TbCriticalOperationalParameter.seuId))
      .innerJoin(
        aliasUserValue,
        eq(
          aliasUserValue.id,
          TbCriticalOperationalParameter.valueResponsibleUserId,
        ),
      )
      .innerJoin(
        aliasUserDeviation,
        eq(
          aliasUserDeviation.id,
          TbCriticalOperationalParameter.deviationResponsibleUserId,
        ),
      )
      .where(and(...filters))
      .orderBy(TbCriticalOperationalParameter.createdAt);
  }

  export async function get(c: IContextUser, id: string) {
    const aliasUserValue = alias(TbUser, "uv");
    const aliasUserDeviation = alias(TbUser, "ud");

    const [rec] = await c.db
      .select({
        id: TbCriticalOperationalParameter.id,
        seu: {
          id: TbSeu.id,
          name: TbSeu.name,
        },
        energyResource: TbCriticalOperationalParameter.energyResource,
        parameter: TbCriticalOperationalParameter.parameter,
        period: TbCriticalOperationalParameter.period,
        unit: TbCriticalOperationalParameter.unit,
        normalSettingValue: TbCriticalOperationalParameter.normalSettingValue,
        lowerLimit: TbCriticalOperationalParameter.lowerLimit,
        upperLimit: TbCriticalOperationalParameter.upperLimit,
        accuracyCalibrationFrequency:
          TbCriticalOperationalParameter.accuracyCalibrationFrequency,
        measurementTool: TbCriticalOperationalParameter.measurementTool,
        valueResponsibleUser: {
          id: aliasUserValue.id,
          displayName: sql<string>`concat_ws(' ', "uv"."name", "uv"."surname")`,
        },
        deviationResponsibleUser: {
          id: aliasUserDeviation.id,
          displayName: sql<string>`concat_ws(' ', "ud"."name", "ud"."surname")`,
        },
        note: TbCriticalOperationalParameter.note,
        controlDate: TbCriticalOperationalParameter.controlDate,
      })
      .from(TbCriticalOperationalParameter)
      .innerJoin(TbSeu, eq(TbSeu.id, TbCriticalOperationalParameter.seuId))
      .innerJoin(
        aliasUserValue,
        eq(
          aliasUserValue.id,
          TbCriticalOperationalParameter.valueResponsibleUserId,
        ),
      )
      .innerJoin(
        aliasUserDeviation,
        eq(
          aliasUserDeviation.id,
          TbCriticalOperationalParameter.deviationResponsibleUserId,
        ),
      )
      .where(
        and(
          eq(TbCriticalOperationalParameter.orgId, c.session.orgId),
          eq(TbCriticalOperationalParameter.id, id),
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
      seuId: string;
      energyResource: IEnergyResource;
      parameter: string;
      period: IPeriod;
      unit: IUnit;
      normalSettingValue: number;
      lowerLimit: number;
      upperLimit: number;
      accuracyCalibrationFrequency: number;
      measurementTool: string;
      valueResponsibleUserId: string;
      deviationResponsibleUserId: string;
      note: string | null;
      controlDate: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbCriticalOperationalParameter)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        seuId: data.seuId,
        energyResource: data.energyResource,
        parameter: data.parameter,
        period: data.period,
        unit: data.unit,
        normalSettingValue: data.normalSettingValue,
        lowerLimit: data.lowerLimit,
        upperLimit: data.upperLimit,
        accuracyCalibrationFrequency: data.accuracyCalibrationFrequency,
        measurementTool: data.measurementTool,
        valueResponsibleUserId: data.valueResponsibleUserId,
        deviationResponsibleUserId: data.deviationResponsibleUserId,
        note: data.note,
        controlDate: data.controlDate,
      })
      .returning({ id: TbCriticalOperationalParameter.id });
    return record.id;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      seuId: string;
      energyResource: IEnergyResource;
      parameter: string;
      period: IPeriod;
      unit: IUnit;
      normalSettingValue: number;
      lowerLimit: number;
      upperLimit: number;
      accuracyCalibrationFrequency: number;
      measurementTool: string;
      valueResponsibleUserId: string;
      deviationResponsibleUserId: string;
      note: string | null;
      controlDate: string;
    },
  ) {
    await c.db
      .update(TbCriticalOperationalParameter)
      .set({
        seuId: data.seuId,
        energyResource: data.energyResource,
        parameter: data.parameter,
        period: data.period,
        unit: data.unit,
        normalSettingValue: data.normalSettingValue,
        lowerLimit: data.lowerLimit,
        upperLimit: data.upperLimit,
        accuracyCalibrationFrequency: data.accuracyCalibrationFrequency,
        measurementTool: data.measurementTool,
        valueResponsibleUserId: data.valueResponsibleUserId,
        deviationResponsibleUserId: data.deviationResponsibleUserId,
        note: data.note,
        controlDate: data.controlDate,
      })
      .where(
        and(
          eq(TbCriticalOperationalParameter.id, id),
          eq(TbCriticalOperationalParameter.orgId, c.session.orgId),
        ),
      );
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbCriticalOperationalParameter)
      .where(
        and(
          eq(TbCriticalOperationalParameter.orgId, c.session.orgId),
          eq(TbCriticalOperationalParameter.id, id),
        ),
      );
  }
}
