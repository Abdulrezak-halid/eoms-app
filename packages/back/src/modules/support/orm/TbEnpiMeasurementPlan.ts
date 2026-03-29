import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbEnpi } from "@m/analysis/orm/TbEnpi";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbEnpiMeasurementPlan = pgTable(
  "tb_support_enpi_measurement_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    enpiId: uuid()
      .notNull()
      .references(() => TbEnpi.id),
    energyInput: real().notNull(),
    energyVariables: text().notNull(),
    idealMeasurementTools: text().notNull(),
    availableMeasurementTools: text().notNull(),
    monitoringAbsenceGap: text().notNull(),
    measurementPlan: text().notNull(),
    requiredRange: real().notNull(),
    engineeringUnit: text().notNull(),
    dataCollectionMethod: text().notNull(),
    dataCollectionPeriod: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
