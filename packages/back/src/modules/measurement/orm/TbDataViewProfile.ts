import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataDataViewType } from "../interfaces/IDataViewTypeOptions";

export const TbDataViewProfile = pgTable(
  "tb_measurement_metric_view_profiles",
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
    description: text(),
    viewType: text({ enum: DataDataViewType }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name)],
);
