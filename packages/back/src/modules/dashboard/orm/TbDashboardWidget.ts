import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbAdvancedRegressionResult } from "@m/analysis/orm/TbAdvancedRegressionResult";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { TbDataViewProfile } from "@m/measurement/orm/TbDataViewProfile";
import { TbMetric } from "@m/measurement/orm/TbMetric";

import { DataDashboardWidgetType } from "../interfaces/IDashboardWidgetType";

export const TbDashboardWidget = pgTable(
  "tb_dashboard_widgets",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    index: integer().notNull(),
    column: integer().notNull().default(0), // default is for migration
    widgetType: text({ enum: DataDashboardWidgetType }).notNull(),
    dataViewId: uuid().references(() => TbDataViewProfile.id), // nullable
    regressionResultId: uuid().references(() => TbAdvancedRegressionResult.id), // nullable
    metricId: uuid().references(() => TbMetric.id), // nullable
  },
  (t) => [index().on(t.orgId, t.column, t.index)],
);
