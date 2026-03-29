import { jsonb, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "./TbOrganization";

export const TbOrganizationConfig = pgTable(
  "tb_organization_configs",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    key: text().notNull(),
    value: jsonb().notNull(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.key] })],
);
