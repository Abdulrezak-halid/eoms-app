import { IUnitGroup } from "common";
import { eq, sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbDepartment } from "@m/base/orm/TbDepartment";

import { TbMeter } from "./TbMeter";
import { TbMeterSlice } from "./TbMeterSlice";
import { TbMetric } from "./TbMetric";

export const VwMeterSlice = pgView("vw_measurement_meter_slice").as((qb) =>
  qb
    .select({
      orgId: sql<string>`${TbMeterSlice.orgId}`.as("vwMeterSliceOrgId"),
      id: sql<string>`${TbMeterSlice.id}`.as("vwMeterSliceId"),
      rate: sql<number>`${TbMeterSlice.rate}`.as("vwMeterSliceRate"),
      isMain: sql<boolean>`${TbMeterSlice.isMain}`.as("vwMeterSliceIsMain"),
      energyConversionRate: sql<number>`${TbMeter.energyConversionRate}`.as(
        "vwMeterSliceEnergyConversionRate",
      ),
      name: sql<string>`concat(${TbMetric.name}, ' - ', ${TbDepartment.name})`.as(
        "vwMeterSliceName",
      ),
      meterId: sql<string>`${TbMeterSlice.subjectId}`.as("vwMeterSliceMeterId"),
      metricId: sql<string>`${TbMetric.id}`.as("vwMeterSliceMetricId"),
      metricName: sql<string>`${TbMetric.name}`.as("vwMeterSliceMetricName"),
      metricUnitGroup: sql<IUnitGroup>`${TbMetric.unitGroup}`.as(
        "vwMeterSliceMetricUnitGroup",
      ),
      departmentId: sql<string>`${TbMeterSlice.departmentId}`.as(
        "vwMeterSliceDepartmentId",
      ),
      departmentName: sql<string>`${TbDepartment.name}`.as(
        "vwMeterSliceDepartmentName",
      ),
      energyResource: sql<IEnergyResource>`${TbMeter.energyResource}`.as(
        "vwMeterSliceEnergyResource",
      ),
    })
    .from(TbMeterSlice)
    .innerJoin(TbMeter, eq(TbMeter.id, TbMeterSlice.subjectId))
    .innerJoin(TbMetric, eq(TbMetric.id, TbMeter.metricId))
    .innerJoin(TbDepartment, eq(TbDepartment.id, TbMeterSlice.departmentId)),
);
