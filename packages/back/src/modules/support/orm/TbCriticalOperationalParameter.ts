import { DataUnit } from "common";
import {
  date,
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbCriticalOperationalParameter = pgTable(
  "tb_support_critical_operational_parameters",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    energyResource: text({ enum: DataEnergyResource }).notNull(),
    parameter: text().notNull(),
    period: text({ enum: DataPeriod }).notNull(),
    unit: text({ enum: DataUnit }).notNull(),
    normalSettingValue: real().notNull(),
    lowerLimit: real().notNull(),
    upperLimit: real().notNull(),
    accuracyCalibrationFrequency: real().notNull(),
    measurementTool: text().notNull(),
    valueResponsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    deviationResponsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    note: text(), // Nullable
    controlDate: date({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
