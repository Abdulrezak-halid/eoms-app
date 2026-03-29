import { IUnitGroup } from "common";
import {
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";

import { INameList } from "../interfaces/INameList";

export const TbLinearRegressionResult = pgTable(
  "tb_analysis_linear_regression_results",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    energyResource: text({ enum: DataEnergyResource }).notNull(),
    // No id foreign key on purpose
    meterSlices: jsonb().$type<INameList>().notNull(),
    // No id foreign key on purpose
    driver: jsonb()
      .$type<{
        id: string;
        name: string;
        unitGroup: IUnitGroup;
      }>()
      .notNull(),
    datetimeStart: timestamp({ mode: "string" }).notNull(),
    datetimeEnd: timestamp({ mode: "string" }).notNull(),
    period: text({ enum: DataMetricResourceValuePeriod }).notNull(),
    slope: real().notNull(),
    intercept: real().notNull(),
    rSquared: real().notNull(),
    ignoredRecordCount: integer().notNull(),
    // interpolateRate: real().notNull(),
    // interpolatedRecordCount: integer().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // orgId, createdAt: ServiceLinearRegression.getAllResults
    index().on(t.orgId, t.createdAt),
  ],
);
