/**
 * @file: TbUser.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 08.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { sql } from "drizzle-orm";
import {
  BuildAliasTable,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "./TbOrganization";

export const TbUser = pgTable(
  "tb_users",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    email: text().notNull().unique(),
    passwordHash: text().notNull(),
    lastSessionAt: timestamp({ mode: "string" }),
    createdAt: timestamp({ mode: "string" }).notNull(),

    name: text().notNull(),
    surname: text(), // nullable
    phone: text(), // nullable
    position: text(), // nullable
  },
  (t) => [
    // orgId, email: login
    index().on(t.orgId, t.email),

    // orgId: sys organization delete
    // orgId, createdAt: users get
    index().on(t.orgId, t.createdAt),

    // lastSessionAt: sys users
    index().on(t.lastSessionAt),
  ],
);

export function sqlUserDisplayName(
  alias: typeof TbUser | BuildAliasTable<typeof TbUser, string> = TbUser,
) {
  return sql<string>`concat_ws(' ', ${alias.name}, ${alias.surname})`;
}
