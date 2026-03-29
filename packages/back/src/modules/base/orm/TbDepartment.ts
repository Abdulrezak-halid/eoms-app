import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "./TbOrganization";
import { TbUser } from "./TbUser";

export const TbDepartment = pgTable(
  "tb_base_departments",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    description: text(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
