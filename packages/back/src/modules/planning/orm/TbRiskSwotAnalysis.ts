import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbRiskSwotAnalysis = pgTable(
  "tb_planning_risk_swot_analysis",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    type: text().notNull(),
    description: text(),
    solutions: text().notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    analysisCreatedAt: date({ mode: "string" }).notNull(),
    estimatedCompletionDate: date({ mode: "string" }).notNull(),
    completedAt: date({ mode: "string" }).notNull(),
    isActionRequired: boolean().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
