import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbMaintenanceActivity = pgTable(
  "tb_measurement_maintenance_activities",
  {
    id: uuid().primaryKey().defaultRandom(),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    task: text().notNull(),
    period: text({ enum: DataPeriod }).notNull(),
    lastMaintainedAt: date({ mode: "string" }).notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    note: text(), // nullable
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
