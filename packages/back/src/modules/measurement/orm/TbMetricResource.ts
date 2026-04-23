import { bigint, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMetric } from "./TbMetric";

export const TbMetricResource = pgTable(
  "tb_measurement_metric_resources",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
    hash: bigint({ mode: "bigint" }).notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.metricId, t.hash)],
);
