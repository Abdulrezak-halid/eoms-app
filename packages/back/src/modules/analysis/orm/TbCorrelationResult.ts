import { IUnitGroup } from "common";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";

export const TbCorrelationResult = pgTable(
  "tb_analysis_driver_correlation_results",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    // No id foreign key on purpose
    metrics: jsonb()
      .$type<
        {
          id: string;
          name: string;
          unitGroup: IUnitGroup;
        }[]
      >()
      .notNull(),
    datetimeStart: timestamp({ mode: "string" }).notNull(),
    datetimeEnd: timestamp({ mode: "string" }).notNull(),
    period: text({ enum: DataMetricResourceValuePeriod }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // orgId, createdAt: ServiceCorrelation.getAllResults
    index().on(t.orgId, t.createdAt),
  ],
);
