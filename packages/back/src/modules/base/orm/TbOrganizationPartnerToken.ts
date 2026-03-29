import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "./TbOrganization";
import { TbUser } from "./TbUser";

export const TbOrganizationPartnerToken = pgTable(
  "tb_organization_partner_tokens",
  {
    token: text().primaryKey(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    createdBy: uuid()
      .references(() => TbUser.id)
      .notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId)],
);
