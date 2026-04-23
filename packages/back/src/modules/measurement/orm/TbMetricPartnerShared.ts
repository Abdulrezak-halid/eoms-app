import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbMetric } from "./TbMetric";

export const TbMetricPartnerShared = pgTable(
  "tb_measurement_metric_partner_shared",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbMetric.id),
    partnerId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
  },
  (t) => [index().on(t.orgId, t.subjectId)],
);
