import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbCopMeasurementPlan = pgTable(
  "tb_support_cop_measurement_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    energyVariables: text().notNull(),
    optimalMeasurementTools: text().notNull(),
    availableMeasurementTools: text().notNull(),
    monitoringAbsenceGap: text().notNull(),
    measurementPlan: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
