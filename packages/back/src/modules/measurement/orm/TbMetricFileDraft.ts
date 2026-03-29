import {
  jsonb,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbUser } from "@m/base/orm/TbUser";

import { IMetricFileDraftContentRecord } from "../interfaces/IMetricFileDraftContentRecord";
import { TbMetric } from "./TbMetric";

export const TbMetricFileDraft = pgTable(
  "tb_measurement_metric_file_drafts",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),

    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),

    createdBy: uuid()
      .notNull()
      .references(() => TbUser.id),
    createdAt: timestamp({ mode: "string" }).notNull(),

    content: jsonb().$type<IMetricFileDraftContentRecord[]>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.metricId] })],
);
