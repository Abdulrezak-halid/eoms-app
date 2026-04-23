import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbTarget = pgTable(
  "tb_planning_targets",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    year: integer().notNull(),
    energyResource: text({ enum: DataEnergyResource }).notNull(),
    consumption: integer().notNull(),
    percentage: integer().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
