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

export const TbUserToken = pgTable(
  "tb_base_user_tokens",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    name: text().notNull(),
    token: text().notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
