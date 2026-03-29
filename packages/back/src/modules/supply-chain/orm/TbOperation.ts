import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { TbPipeline } from "./TbPipeline";

export const TbOperation = pgTable(
  "tb_operations",
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
    pipelineId: uuid()
      .notNull()
      .references(() => TbPipeline.id),
    index: integer().notNull(),
  },
  (t) => [index().on(t.orgId, t.pipelineId, t.index)],
);
