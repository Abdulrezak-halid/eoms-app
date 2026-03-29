import {
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { DataEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { TbMetric } from "./TbMetric";

export const TbMeter = pgTable(
  "tb_measurement_meters",
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
    energyResource: text({ enum: DataEnergyResource }).notNull(),
    energyConversionRate: real().notNull().default(1),
    metricId: uuid()
      .references(() => TbMetric.id)
      .notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.name)],
);
