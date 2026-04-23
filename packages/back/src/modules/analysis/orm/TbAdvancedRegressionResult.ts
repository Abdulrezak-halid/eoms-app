import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbAdvancedRegressionResult = pgTable(
  "tb_analysis_advanced_regression_result",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    // No id foreign key on purpose
    seuId: uuid().references(() => TbSeu.id), //nullable
    primary: boolean().notNull().default(false),
    dateTrainStart: timestamp({ mode: "string" }).notNull(),
    dateTrainEnd: timestamp({ mode: "string" }).notNull(),
    datePredictStart: timestamp({ mode: "string" }).notNull(),
    datePredictEnd: timestamp({ mode: "string" }).notNull(),
    period: text({ enum: DataMetricResourceValuePeriod }).notNull(),

    // trainRecordInterpolatedCount: integer().notNull(),
    // trainRecordInterpolateRate: real().notNull(),
    trainRecordIgnoredCount: integer().notNull(),

    // predictRecordInterpolatedCount: integer().notNull(),
    // predictRecordInterpolateRate: real().notNull(),
    // predictRecordIgnoredCount: integer().notNull(),

    rSquared: real(), // nullable
    rmse: real().notNull(),

    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // orgId, seuId: ServiceAdvancedRegression.setPrimary
    index().on(t.orgId, t.seuId),
  ],
);
