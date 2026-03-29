import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { IOrganizationPlan } from "../interfaces/IOrganizationPlan";
import { IPermission } from "../interfaces/IPermission";
import { TbOrganization } from "./TbOrganization";
import { TbUser } from "./TbUser";

export const TbUserSession = pgTable(
  "tb_sessions",
  {
    token: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    userId: uuid()
      .notNull()
      .references(() => TbUser.id),
    permissions: jsonb().notNull().$type<IPermission[]>(),
    orgPlan: jsonb().notNull().$type<IOrganizationPlan>(),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // userId: bulk delete
    index().on(t.userId),
  ],
);
