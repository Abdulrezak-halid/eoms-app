import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataDocumentApprovementStatus } from "../interfaces/IDocumentApprovementStatus";

export const TbActionPlan = pgTable(
  "tb_planning_action_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    reasonsForStatus: text().notNull(),
    startDate: date({ mode: "string" }).notNull(),
    targetIdentificationDate: date({ mode: "string" }).notNull(),
    actualIdentificationDate: date({ mode: "string" }).notNull(),
    actualSavingsVerifications: text().notNull(),
    actualSavings: text().notNull(),
    approvementStatus: text({ enum: DataDocumentApprovementStatus }).notNull(),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
