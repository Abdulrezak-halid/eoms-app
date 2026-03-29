import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbMeterSlice } from "@m/measurement/orm/TbMeterSlice";

import { TbAdvancedRegressionResult } from "./TbAdvancedRegressionResult";

export const TbAdvancedRegressionResultSlice = pgTable(
  "tb_advanced_regression_result_slices",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbAdvancedRegressionResult.id),
    sliceId: uuid()
      .notNull()
      .references(() => TbMeterSlice.id),
  },
  (t) => [uniqueIndex().on(t.orgId, t.subjectId, t.sliceId)],
);
