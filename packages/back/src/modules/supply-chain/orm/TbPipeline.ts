import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbPipeline = pgTable(
  "tb_pipelines",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    name: text().notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name)],
);
