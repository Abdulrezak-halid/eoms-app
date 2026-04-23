import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { TbDesign } from "./TbDesign";

export const TbDesignIdea = pgTable(
  "tb_planning_design_ideas",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    designId: uuid()
      .notNull()
      .references(() => TbDesign.id),
    no: text().notNull(),
    name: text().notNull(),
    risks: text().notNull(),
    reduction: text().notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    uniqueIndex().on(t.orgId, t.name),
    index().on(t.orgId, t.designId, t.createdAt),
  ],
);
