import { DataUnitGroup } from "common";
import {
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { DataMetricType } from "../interfaces/IMetricType";

export const TbMetric = pgTable(
  "tb_measurement_metrics",
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
    type: text({ enum: DataMetricType }).notNull(),
    unitGroup: text({ enum: DataUnitGroup }).notNull(),

    lastValue: doublePrecision(),
    lastValueDatetime: timestamp({ mode: "string" }),
    valuesUpdatedAt: timestamp({ mode: "string" }),
  },
  (t) => [
    // orgId, name: ServiceMetric, ServiceDataView
    uniqueIndex().on(t.orgId, t.name),
    index().on(t.orgId, t.type, t.name),
  ],
);
