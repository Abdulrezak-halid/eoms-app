import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbCopMeasurementPlan } from "@m/support/orm/TbCopMeasurementPlan";

export namespace ServiceCopMeasurementPlan {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbCopMeasurementPlan.id,
        energyVariables: TbCopMeasurementPlan.energyVariables,
        optimalMeasurementTools: TbCopMeasurementPlan.optimalMeasurementTools,
        availableMeasurementTools:
          TbCopMeasurementPlan.availableMeasurementTools,
        monitoringAbsenceGap: TbCopMeasurementPlan.monitoringAbsenceGap,
        measurementPlan: TbCopMeasurementPlan.measurementPlan,
      })
      .from(TbCopMeasurementPlan)
      .where(eq(TbCopMeasurementPlan.orgId, c.session.orgId))
      .orderBy(TbCopMeasurementPlan.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      energyVariables: string;
      optimalMeasurementTools: string;
      availableMeasurementTools: string;
      monitoringAbsenceGap: string;
      measurementPlan: string;
    },
  ) {
    const [record] = await c.db
      .insert(TbCopMeasurementPlan)
      .values({
        orgId: c.session.orgId,
        createdAt: c.nowDatetime,
        createdBy: c.session.userId,
        energyVariables: data.energyVariables,
        optimalMeasurementTools: data.optimalMeasurementTools,
        availableMeasurementTools: data.availableMeasurementTools,
        monitoringAbsenceGap: data.monitoringAbsenceGap,
        measurementPlan: data.measurementPlan,
      })
      .returning({ id: TbCopMeasurementPlan.id });
    return record.id;
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbCopMeasurementPlan.id,
        energyVariables: TbCopMeasurementPlan.energyVariables,
        optimalMeasurementTools: TbCopMeasurementPlan.optimalMeasurementTools,
        availableMeasurementTools:
          TbCopMeasurementPlan.availableMeasurementTools,
        monitoringAbsenceGap: TbCopMeasurementPlan.monitoringAbsenceGap,
        measurementPlan: TbCopMeasurementPlan.measurementPlan,
      })
      .from(TbCopMeasurementPlan)
      .where(
        and(
          eq(TbCopMeasurementPlan.orgId, c.session.orgId),
          eq(TbCopMeasurementPlan.id, id),
        ),
      );

    if (!record) {
      throw new ApiException(EApiFailCode.NOT_FOUND);
    }
    return record;
  }

  export async function update(
    c: IContextUser,
    id: string,
    data: {
      energyVariables: string;
      optimalMeasurementTools: string;
      availableMeasurementTools: string;
      monitoringAbsenceGap: string;
      measurementPlan: string;
    },
  ) {
    await c.db
      .update(TbCopMeasurementPlan)
      .set({
        energyVariables: data.energyVariables,
        optimalMeasurementTools: data.optimalMeasurementTools,
        availableMeasurementTools: data.availableMeasurementTools,
        monitoringAbsenceGap: data.monitoringAbsenceGap,
        measurementPlan: data.measurementPlan,
      })
      .where(
        and(
          eq(TbCopMeasurementPlan.orgId, c.session.orgId),
          eq(TbCopMeasurementPlan.id, id),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbCopMeasurementPlan)
      .where(
        and(
          eq(TbCopMeasurementPlan.orgId, c.session.orgId),
          eq(TbCopMeasurementPlan.id, id),
        ),
      );
  }
}
