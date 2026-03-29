import { integer, pgTable, real, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbCorrelationResult } from "./TbCorrelationResult";

export const TbCorrelationResultValue = pgTable(
  "tb_analysis_correlation_result_values",
  {
    id: uuid().primaryKey().defaultRandom(),
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbCorrelationResult.id),
    metricAId: uuid().notNull(),
    metricBId: uuid().notNull(),
    value: real().notNull(),
    recordCount: integer().notNull(),
    // interpolatedRecordCount: integer().notNull(),
    // interpolateRate: real().notNull(),
  },
);
