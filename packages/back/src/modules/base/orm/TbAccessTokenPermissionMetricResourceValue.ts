import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbMetric } from "@m/measurement/orm/TbMetric";

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
    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.metricId)],
);
