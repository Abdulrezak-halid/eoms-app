import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbMetric } from "@m/measurement/orm/TbMetric";

import { TbAdvancedRegressionResult } from "./TbAdvancedRegressionResult";

export const TbAdvancedRegressionResultDriver = pgTable(
  "tb_advanced_regression_result_drivers",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbAdvancedRegressionResult.id),
    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.metricId)],
);
