import {
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbProcurement = pgTable(
  "tb_support_procurements",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    product: text().notNull(),
    category: text().notNull(),
    criteriaList: text().notNull(),
    suggestedBrand: text().notNull(),
    additionalSpecifications: text().notNull(),
    price: real().notNull(),
    annualMaintenanceCost: real().notNull(),
    lifetimeYears: integer().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
