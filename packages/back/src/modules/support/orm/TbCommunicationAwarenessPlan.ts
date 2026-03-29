import {
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataPlanType } from "../interfaces/IPlanType";

export const TbCommunicationAwarenessPlan = pgTable(
  "tb_support_communication_awareness_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    action: text().notNull(),
    type: text({ enum: DataPlanType }).notNull(),
    information: text().notNull(),
    releasedAt: date({ mode: "string" }).notNull(),
    releaseLocations: jsonb().notNull().$type<string[]>(),
    feedback: text().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
