import {
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbDesign = pgTable(
  "tb_planning_designs",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    no: integer().notNull(),
    purpose: text().notNull(),
    impact: text().notNull(),
    estimatedSavings: real().notNull(),
    estimatedAdditionalCost: real().notNull(),
    estimatedTurnaroundMonths: real().notNull(),
    leaderUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    potentialNonEnergyBenefits: text().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
