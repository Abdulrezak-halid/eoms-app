/**
 * @file: TbIssue.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.12.2024
 * Last Modified Date: 25.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataIssueType } from "../interfaces/IIssueType";

export const TbIssue = pgTable(
  "tb_issues",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    type: text({ enum: DataIssueType }).notNull(),
    description: text(),
    createdBy: uuid().references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // For main sort
    index().on(t.createdAt),
  ],
);
