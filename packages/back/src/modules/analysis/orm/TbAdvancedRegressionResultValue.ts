import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbMeterSlice } from "@m/measurement/orm/TbMeterSlice";
import { TbMetric } from "@m/measurement/orm/TbMetric";

import { DataAdvancedRegressionResultValueType } from "../interfaces/IAdvancedRegressionResultValueType";
import { TbAdvancedRegressionResult } from "./TbAdvancedRegressionResult";

export const TbAdvancedRegressionResultValue = pgTable(
  "tb_analysis_advanced_regression_result_values",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbAdvancedRegressionResult.id),
    sourceMeterSliceId: uuid().references(() => TbMeterSlice.id), // nullable
    sourceMetricId: uuid().references(() => TbMetric.id), // nullable
    value: real().notNull(),
    type: text({ enum: DataAdvancedRegressionResultValueType }).notNull(),
    datetime: timestamp({ mode: "string" }).notNull(),
  },
  (t) => [
    // orgId, subjectId, datetime: ServiceAdvancedRegression.getResult
    index().on(t.orgId, t.subjectId, t.datetime),
  ],
);
