import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";
import { IAgentStat } from "@m/measurement/interfaces/IAgentStat";
import { DataAgentStatType } from "@m/measurement/interfaces/IAgentStatType";

export const TbAgent = pgTable(
  "tb_agents",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    createdAt: timestamp({ mode: "string" }).notNull(),
    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    assignedOrgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    name: text().notNull(),
    serialNo: text().notNull(),
    description: text(),

    statType: text({ enum: DataAgentStatType }), // nullable
    stats: jsonb().$type<IAgentStat>(), // nullable
    datetimeStat: timestamp({ mode: "string" }), // nullable
  },
  (t) => [
    uniqueIndex().on(t.orgId, t.name),

    // assignedOrgId, createdAt: ServiceAgent.getAll
    index().on(t.orgId, t.createdAt),

    // assignedOrgId, createdAt: ServiceAgent.getAllByAssignedOrgId
    index().on(t.assignedOrgId, t.createdAt),
  ],
);
