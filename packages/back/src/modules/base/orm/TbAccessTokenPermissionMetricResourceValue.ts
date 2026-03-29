import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbAccessToken } from "./TbAccessToken";
import { TbOrganization } from "./TbOrganization";

export const TbAccessTokenPermissionMetricResourceValue = pgTable(
  "tb_base_access_token_permission_metric_resource_values",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbAccessToken.id),
    // Keep metric id as raw uuid in cleanup baseline.
    // Measurement module and its tables are intentionally removed.
    metricId: uuid().notNull(),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.metricId)],
);
