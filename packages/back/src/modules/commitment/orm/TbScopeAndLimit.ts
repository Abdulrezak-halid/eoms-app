import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

export const TbScopeAndLimit = pgTable(
  "tb_commitment_scope_and_limits",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    physicalLimits: text().notNull(),
    excludedResources: jsonb().notNull().$type<IEnergyResource[]>(),
    excludedResourceReason: text().notNull(),
    products: jsonb().$type<string[]>().notNull(),
  },
  (t) => [index().on(t.orgId, t.createdAt)],
);
