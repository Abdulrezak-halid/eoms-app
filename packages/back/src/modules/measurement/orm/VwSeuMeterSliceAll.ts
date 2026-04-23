import { and, eq, sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

import { TbMeter } from "./TbMeter";
import { TbMeterSlice } from "./TbMeterSlice";
import { TbSeu } from "./TbSeu";
import { TbSeuDepartment } from "./TbSeuDepartment";
import { TbSeuMeterSlice } from "./TbSeuMeterSlice";

// Finds seu department meter slices with the same energy resource and
//   includes manually selected meter slices
export const VwSeuMeterSliceAll = pgView(
  "vw_measurement_seu_meter_slices_all",
).as((qb) =>
  qb
    .select({
      orgId: sql<string>`${TbSeu.orgId}`.as("sqSeuOrgId"),
      seuId: sql<string>`${TbSeu.id}`.as("sqSeuId"),
      meterSliceId: sql<string>`${TbMeterSlice.id}`.as("sqMeterSliceId"),
    })
    .from(TbSeu)
    .innerJoin(TbSeuDepartment, eq(TbSeuDepartment.subjectId, TbSeu.id))
    .innerJoin(
      TbMeterSlice,
      eq(TbMeterSlice.departmentId, TbSeuDepartment.departmentId),
    )
    .innerJoin(
      TbMeter,
      and(
        eq(TbMeter.id, TbMeterSlice.subjectId),
        eq(TbMeter.energyResource, TbSeu.energyResource),
      ),
    )
    .unionAll(
      qb
        .select({
          orgId: sql<string>`${TbSeuMeterSlice.orgId}`.as("sqSeuOrgId"),
          seuId: sql<string>`${TbSeuMeterSlice.subjectId}`.as("sqSeuId"),
          meterSliceId: sql<string>`${TbSeuMeterSlice.meterSliceId}`.as(
            "sqMeterSliceId",
          ),
        })
        .from(TbSeuMeterSlice),
    ),
);
