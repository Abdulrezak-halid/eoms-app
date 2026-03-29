import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { DataPeriod } from "@m/commitment/interfaces/IPeriod";

export const TbEnergyPolicy = pgTable(
  "tb_commitment_energy_policies",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    content: text().notNull(),
    type: text(), // nullable
    target: text(), // nullable
    period: text({ enum: DataPeriod }).notNull(),
  },
  (t) => [
    uniqueIndex().on(t.orgId, t.content),
    index().on(t.orgId, t.createdAt),
  ],
);
