import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbDataViewProfile } from "./TbDataViewProfile";
import { TbMetric } from "../../measurement/orm/TbMetric";

export const TbDataViewProfileMetric = pgTable(
  "tb_measurement_metric_view_profile_metrics",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),

    subjectId: uuid()
      .notNull()
      .references(() => TbDataViewProfile.id),

    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.metricId)],
);
