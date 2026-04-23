import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { TbSeu } from "@m/measurement/orm/TbSeu";

export const TbProcurementProcedure = pgTable(
  "tb_support_procurement_producedures",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    seuId: uuid()
      .notNull()
      .references(() => TbSeu.id),
    equipmentSpecifications: text().notNull(),
    serviceSpecifications: text().notNull(),
    nextReviewAt: date({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
