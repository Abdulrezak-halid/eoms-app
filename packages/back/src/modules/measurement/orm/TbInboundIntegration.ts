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

import { DataInboundIntegrationType } from "../interfaces/IInboundIntegrationType";

export const TbInboundIntegration = pgTable(
  "tb_measurement_inbound_integrations",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    enabled: boolean().notNull().default(true),
    name: text().notNull(),
    type: text({ enum: DataInboundIntegrationType }).notNull(),
    lastRunAt: timestamp({ mode: "string" }), // nullable
  },
  (t) => [uniqueIndex().on(t.orgId, t.name), index().on(t.orgId, t.createdAt)],
);
