import {
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { IJobMeta } from "../interfaces/IJobMeta";

export const TbJob = pgTable(
  "tb_jobs",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    meta: jsonb().notNull().$type<IJobMeta>(),
    failInfo: jsonb().$type<{ msg: string; datetime: string }>(),
    runCount: integer().notNull().default(0), // run count
    runFailCount: integer().notNull().default(0),
    createdAt: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // createdAt: ServiceJob.getAll
    index().on(t.createdAt),
  ],
);
