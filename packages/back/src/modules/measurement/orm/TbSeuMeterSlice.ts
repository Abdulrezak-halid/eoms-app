import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMeterSlice } from "./TbMeterSlice";
import { TbSeu } from "./TbSeu";

export const TbSeuMeterSlice = pgTable(
  "tb_measurement_seu_meter_slices",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    meterSliceId: uuid()
      .references(() => TbMeterSlice.id)
      .unique(),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
