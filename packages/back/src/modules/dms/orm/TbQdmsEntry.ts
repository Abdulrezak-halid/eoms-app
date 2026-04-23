import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataQdmsIntegrationBindingPage } from "../interfaces/IQdmsIntegrationBindingPage";

export const TbQdmsEntry = pgTable(
  "tb_dms_qdms_entries",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),

    name: text().notNull(),
    bindingPage: text({ enum: DataQdmsIntegrationBindingPage }).notNull(),
    endpointUrl: text().notNull(),
    isEnabled: boolean().notNull(),
    lastFetchedAt: timestamp({ mode: "string" }),
  },
  (t) => [
    // orgId, bindingPage, name: ServiceQdmsIntegration.getAll
    index().on(t.orgId, t.bindingPage, t.name),
    uniqueIndex().on(t.orgId, t.name),
  ],
);
