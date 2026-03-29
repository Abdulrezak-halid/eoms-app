import {
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
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbEnpi = pgTable(
  "tb_analysis_enpis",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    equipment: text().notNull(),
    targetedDate: date({ mode: "string" }).notNull(),
    targetedImprovement: integer().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
