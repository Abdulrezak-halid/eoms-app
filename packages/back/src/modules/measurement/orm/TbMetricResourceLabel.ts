import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMetricResource } from "./TbMetricResource";

export const TbMetricResourceLabel = pgTable(
  "tb_measurement_metric_resource_labels",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    resourceId: uuid()
      .notNull()
      .references(() => TbMetricResource.id),
    type: text({ enum: ["INTERNAL", "USER_DEFINED"] }).notNull(),
    key: text().notNull(),
    value: text().notNull(),
  },
  (t) => [
    // A resource cannot have more than one label with the same key
    uniqueIndex().on(t.orgId, t.resourceId, t.type, t.key),
  ],
);
