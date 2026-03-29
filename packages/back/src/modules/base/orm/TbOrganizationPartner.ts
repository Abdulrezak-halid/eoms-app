import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "./TbOrganization";

export const TbOrganizationPartner = pgTable(
  "tb_organization_partners",
  {
    orgTokenOwnerId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    orgTokenUserId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.orgTokenOwnerId, t.orgTokenUserId] }),
    index().on(t.orgTokenOwnerId, t.createdAt),
    index().on(t.orgTokenUserId, t.createdAt),
  ],
);
