import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbSeu } from "@m/measurement/orm/TbSeu";

import { TbDashboardWidget } from "./TbDashboardWidget";

export const TbDashboardWidgetSeu = pgTable(
  "tb_dashboard_widget_seus",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .references(() => TbDashboardWidget.id)
      .notNull(),
    seuId: uuid()
      .references(() => TbSeu.id)
      .notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.seuId)],
);
