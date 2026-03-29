import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbEnpi } from "@m/analysis/orm/TbEnpi";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";

import { TbEnpiMeasurementPlan } from "../orm/TbEnpiMeasurementPlan";

export namespace ServiceEnpiMeasurementPlan {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbEnpiMeasurementPlan.id,
        enpi: {
          id: TbEnpi.id,
          displayName: TbEnpi.equipment,
        },
        energyInput: TbEnpiMeasurementPlan.energyInput,
        energyVariables: TbEnpiMeasurementPlan.energyVariables,
        idealMeasurementTools: TbEnpiMeasurementPlan.idealMeasurementTools,
        availableMeasurementTools:
          TbEnpiMeasurementPlan.availableMeasurementTools,
        monitoringAbsenceGap: TbEnpiMeasurementPlan.monitoringAbsenceGap,
        measurementPlan: TbEnpiMeasurementPlan.measurementPlan,
        requiredRange: TbEnpiMeasurementPlan.requiredRange,
        engineeringUnit: TbEnpiMeasurementPlan.engineeringUnit,
        dataCollectionMethod: TbEnpiMeasurementPlan.dataCollectionMethod,
        dataCollectionPeriod: TbEnpiMeasurementPlan.dataCollectionPeriod,
      })
      .from(TbEnpiMeasurementPlan)
      .innerJoin(TbEnpi, eq(TbEnpiMeasurementPlan.enpiId, TbEnpi.id))
      .where(eq(TbEnpiMeasurementPlan.orgId, c.session.orgId))
      .orderBy(TbEnpiMeasurementPlan.createdAt);
  }
  export async function get(c: IContextUser, id: string) {
    const [rec] = await c.db
      .select({
        id: TbEnpiMeasurementPlan.id,
        enpi: {
          id: TbEnpi.id,
          displayName: TbEnpi.equipment,
        },
        energyInput: TbEnpiMeasurementPlan.energyInput,
        energyVariables: TbEnpiMeasurementPlan.energyVariables,
        idealMeasurementTools: TbEnpiMeasurementPlan.idealMeasurementTools,
        availableMeasurementTools:
          TbEnpiMeasurementPlan.availableMeasurementTools,
        monitoringAbsenceGap: TbEnpiMeasurementPlan.monitoringAbsenceGap,
        measurementPlan: TbEnpiMeasurementPlan.measurementPlan,
        requiredRange: TbEnpiMeasurementPlan.requiredRange,
        engineeringUnit: TbEnpiMeasurementPlan.engineeringUnit,
        dataCollectionMethod: TbEnpiMeasurementPlan.dataCollectionMethod,
        dataCollectionPeriod: TbEnpiMeasurementPlan.dataCollectionPeriod,
      })
      .from(TbEnpiMeasurementPlan)
      .innerJoin(TbEnpi, eq(TbEnpiMeasurementPlan.enpiId, TbEnpi.id))
      .where(
        and(
          eq(TbEnpiMeasurementPlan.orgId, c.session.orgId),
          eq(TbEnpiMeasurementPlan.id, id),
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
      enpiId: string;
      energyInput: number;
      energyVariables: string;
      idealMeasurementTools: string;
      availableMeasurementTools: string;
      monitoringAbsenceGap: string;
      measurementPlan: string;
      requiredRange: number;
      engineeringUnit: string;
      dataCollectionMethod: string;
      dataCollectionPeriod: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbEnpiMeasurementPlan)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        enpiId: data.enpiId,
        energyInput: data.energyInput,
        energyVariables: data.energyVariables,
        idealMeasurementTools: data.idealMeasurementTools,
        availableMeasurementTools: data.availableMeasurementTools,
        monitoringAbsenceGap: data.monitoringAbsenceGap,
        measurementPlan: data.measurementPlan,
        requiredRange: data.requiredRange,
        engineeringUnit: data.engineeringUnit,
        dataCollectionMethod: data.dataCollectionMethod,
        dataCollectionPeriod: data.dataCollectionPeriod,
      })
      .returning({ id: TbEnpiMeasurementPlan.id });
    return record.id;
  }
  export async function update(
    c: IContextUser,
    id: string,
    data: {
      enpiId: string;
      energyInput: number;
      energyVariables: string;
      idealMeasurementTools: string;
      availableMeasurementTools: string;
      monitoringAbsenceGap: string;
      measurementPlan: string;
      requiredRange: number;
      engineeringUnit: string;
      dataCollectionMethod: string;
      dataCollectionPeriod: string;
    },
  ) {
    await c.db
      .update(TbEnpiMeasurementPlan)
      .set({
        enpiId: data.enpiId,
        energyInput: data.energyInput,
        energyVariables: data.energyVariables,
        idealMeasurementTools: data.idealMeasurementTools,
        availableMeasurementTools: data.availableMeasurementTools,
        monitoringAbsenceGap: data.monitoringAbsenceGap,
        measurementPlan: data.measurementPlan,
        requiredRange: data.requiredRange,
        engineeringUnit: data.engineeringUnit,
        dataCollectionMethod: data.dataCollectionMethod,
        dataCollectionPeriod: data.dataCollectionPeriod,
      })
      .where(
        and(
          eq(TbEnpiMeasurementPlan.id, id),
          eq(TbEnpiMeasurementPlan.orgId, c.session.orgId),
        ),
      );
  }
  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbEnpiMeasurementPlan)
      .where(
        and(
          eq(TbEnpiMeasurementPlan.orgId, c.session.orgId),
          eq(TbEnpiMeasurementPlan.id, id),
        ),
      );
  }
}
