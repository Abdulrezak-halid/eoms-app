import { DataUnitGroup } from "common";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbProduct = pgTable(
  "tb_product_base_products",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    code: text().notNull().unique(),
    description: text(),
    unit: text({ enum: DataUnitGroup }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
