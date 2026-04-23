import {
  boolean,
  index,
  pgTable,
  real,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbDepartment } from "@m/base/orm/TbDepartment";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { TbMeter } from "./TbMeter";

export const TbMeterSlice = pgTable(
  "tb_measurement_meter_slices",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),

    subjectId: uuid()
      .notNull()
      .references(() => TbMeter.id),

    departmentId: uuid()
      .references(() => TbDepartment.id)
      .notNull(),

    rate: real().notNull(),

    isMain: boolean().notNull(),
  },
  (t) => [
    // orgId: ServiceMeter.getAllSlices
    index().on(t.orgId, t.subjectId),
  ],
);
