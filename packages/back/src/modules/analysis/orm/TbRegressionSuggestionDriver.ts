import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbMetric } from "@m/measurement/orm/TbMetric";

import { TbRegressionSuggestion } from "./TbRegressionSuggestion";

export const TbRegressionSuggestionDriver = pgTable(
  "tb_regression_suggestion_drivers",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbRegressionSuggestion.id)
      .notNull(),
    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.metricId)],
);
