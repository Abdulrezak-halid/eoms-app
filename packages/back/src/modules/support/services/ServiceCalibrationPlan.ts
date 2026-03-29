import { EApiFailCode } from "common";
import { and, eq } from "drizzle-orm";

import { TbUser, sqlUserDisplayName } from "@m/base/orm/TbUser";
import { ApiException } from "@m/core/exceptions/ApiException";
import { IContextUser } from "@m/core/interfaces/IContext";
import { TbCalibrationPlan } from "@m/support/orm/TbCalibrationPlan";

export namespace ServiceCalibrationPlan {
  export async function getAll(c: IContextUser) {
    return c.db
      .select({
        id: TbCalibrationPlan.id,
        deviceType: TbCalibrationPlan.deviceType,
        deviceNo: TbCalibrationPlan.deviceNo,
        brand: TbCalibrationPlan.brand,
        location: TbCalibrationPlan.location,
        calibration: TbCalibrationPlan.calibration,
        calibrationNo: TbCalibrationPlan.calibrationNo,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        dueTo: TbCalibrationPlan.dueTo,
        nextDate: TbCalibrationPlan.nextDate,
        evaluationResult: TbCalibrationPlan.evaluationResult,
      })
      .from(TbCalibrationPlan)
      .innerJoin(TbUser, eq(TbUser.id, TbCalibrationPlan.responsibleUserId))
      .where(eq(TbCalibrationPlan.orgId, c.session.orgId))
      .orderBy(TbCalibrationPlan.createdAt);
  }

  export async function create(
    c: IContextUser,
    data: {
      deviceType: string;
      deviceNo: string;
      brand: string;
      location: string;
      calibration: string;
      calibrationNo: string;
      responsibleUserId: string;
      dueTo: string;
      nextDate: string;
      evaluationResult: string;
    },
  ) {
    const [records] = await c.db
      .insert(TbCalibrationPlan)
      .values({
        orgId: c.session.orgId,
        createdBy: c.session.userId,
        createdAt: c.nowDatetime,
        deviceType: data.deviceType,
        deviceNo: data.deviceNo,
        brand: data.brand,
        location: data.location,
        calibration: data.calibration,
        calibrationNo: data.calibrationNo,
        responsibleUserId: data.responsibleUserId,
        dueTo: data.dueTo,
        nextDate: data.nextDate,
        evaluationResult: data.evaluationResult,
      })
      .returning({ id: TbCalibrationPlan.id });
    return records.id;
  }

  export async function get(c: IContextUser, id: string) {
    const [record] = await c.db
      .select({
        id: TbCalibrationPlan.id,
        deviceType: TbCalibrationPlan.deviceType,
        deviceNo: TbCalibrationPlan.deviceNo,
        brand: TbCalibrationPlan.brand,
        location: TbCalibrationPlan.location,
        calibration: TbCalibrationPlan.calibration,
        calibrationNo: TbCalibrationPlan.calibrationNo,
        responsibleUser: {
          id: TbUser.id,
          displayName: sqlUserDisplayName(),
        },
        dueTo: TbCalibrationPlan.dueTo,
        nextDate: TbCalibrationPlan.nextDate,
        evaluationResult: TbCalibrationPlan.evaluationResult,
      })
      .from(TbCalibrationPlan)
      .innerJoin(TbUser, eq(TbUser.id, TbCalibrationPlan.responsibleUserId))
      .where(
        and(
          eq(TbCalibrationPlan.orgId, c.session.orgId),
          eq(TbCalibrationPlan.id, id),
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
      deviceType: string;
      deviceNo: string;
      brand: string;
      location: string;
      calibration: string;
      calibrationNo: string;
      responsibleUserId: string;
      dueTo: string;
      nextDate: string;
      evaluationResult: string;
    },
  ) {
    await c.db
      .update(TbCalibrationPlan)
      .set({
        deviceType: data.deviceType,
        deviceNo: data.deviceNo,
        brand: data.brand,
        location: data.location,
        calibration: data.calibration,
        calibrationNo: data.calibrationNo,
        responsibleUserId: data.responsibleUserId,
        dueTo: data.dueTo,
        nextDate: data.nextDate,
        evaluationResult: data.evaluationResult,
      })
      .where(
        and(
          eq(TbCalibrationPlan.id, id),
          eq(TbCalibrationPlan.orgId, c.session.orgId),
        ),
      );
  }

  export async function remove(c: IContextUser, id: string) {
    await c.db
      .delete(TbCalibrationPlan)
      .where(
        and(
          eq(TbCalibrationPlan.id, id),
          eq(TbCalibrationPlan.orgId, c.session.orgId),
        ),
      );
  }
}
