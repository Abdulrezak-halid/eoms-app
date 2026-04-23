import {
  doublePrecision,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMetricResource } from "./TbMetricResource";

export const TbMetricResourceValueRaw = pgTable(
  "tb_measurement_metric_resource_values_raw",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),

    resourceId: uuid()
      .notNull()
      .references(() => TbMetricResource.id),

    type: text({
      enum: ["GAUGE", "COUNTER_CUMULATIVE"],
    }).notNull(),

    datetime: timestamp({ mode: "string" }).notNull(),
    value: doublePrecision().notNull(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.resourceId, t.type, t.datetime] })],
);
