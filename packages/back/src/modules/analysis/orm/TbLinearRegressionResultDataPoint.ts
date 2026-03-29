import { index, pgTable, real, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbLinearRegressionResult } from "./TbLinearRegressionResult";

export const TbLinearRegressionResultDataPoint = pgTable(
  "tb_analysis_linear_regression_result_data_points",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    resultId: uuid()
      .notNull()
      .references(() => TbLinearRegressionResult.id),
    x: real().notNull(),
    y: real().notNull(),
  },
  (t) => [
    // orgId, y: ServiceLinearRegression.getResult
    index().on(t.orgId, t.y),
  ],
);
