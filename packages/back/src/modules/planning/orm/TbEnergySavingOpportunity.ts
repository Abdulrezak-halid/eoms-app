import {
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import "@m/base/interfaces/IEnergyResource";
import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataDocumentApprovementStatus } from "../interfaces/IDocumentApprovementStatus";

export const TbEnergySavingOpportunity = pgTable(
  "tb_planning_energy_saving_opportunities",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    investmentApplicationPeriodMonth: integer().notNull(),
    investmentBudget: real().notNull(),
    estimatedBudgetSaving: real().notNull(),
    paybackMonth: integer().notNull(),
    calculationMethodOfPayback: text().notNull(),
    estimatedSavings: jsonb()
      .notNull()
      .$type<{ energyResource: IEnergyResource; value: number }[]>(),
    notes: text(),
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
