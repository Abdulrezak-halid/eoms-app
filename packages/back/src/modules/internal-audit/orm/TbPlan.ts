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
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbPlan = pgTable(
  "tb_internal_audit_plans",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    responsibleUserId: uuid()
      .notNull()
      .references(() => TbUser.id),
    scheduleDate: date({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },

  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
