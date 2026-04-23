import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbReportAttachment = pgTable(
  "tb_report_attachments",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .references(() => TbOrganization.id)
      .notNull(),
    createdBy: uuid()
      .references(() => TbUser.id)
      .notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    name: text().notNull(),
  },
  (t) => [index().on(t.orgId, t.name)],
);
