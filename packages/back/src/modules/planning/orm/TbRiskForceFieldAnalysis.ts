import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbRiskForceFieldAnalysis = pgTable(
  "tb_planning_risk_force_field_analysis",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    parameter: text().notNull(),
    score: integer().notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    solutions: text().notNull(),
    completedAt: date({ mode: "string" }).notNull(),
    estimatedCompletionDate: date({ mode: "string" }).notNull(),
    isSucceed: boolean().notNull(),
    isFollowUpRequired: boolean().notNull(),
    isActionRequired: boolean().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
