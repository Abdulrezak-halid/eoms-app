import { DataUnit } from "common";
import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";

import { TbInboundIntegration } from "./TbInboundIntegration";
import { TbMetric } from "./TbMetric";
import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbMetricIntegrationOutput = pgTable(
  "tb_measurement_metric_integration_outputs",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    outboundIntegrationId: uuid().references(() => TbOutboundIntegration.id),
    inboundIntegrationId: uuid().references(() => TbInboundIntegration.id),

    isHealthy: boolean(), // nullable
    outputKey: text().notNull(),
    unit: text({ enum: DataUnit }).notNull(),
    metricId: uuid()
      .notNull()
      .references(() => TbMetric.id),
  },
  (t) => [
    uniqueIndex().on(t.orgId, t.outboundIntegrationId, t.outputKey),
    uniqueIndex().on(t.orgId, t.inboundIntegrationId, t.outputKey),

    // Drizzle generates same name for both unique indices,
    //   that's why name is defined.
    uniqueIndex().on(t.metricId),

    // inboundIntegrationId: MqConsumerInboundIntegrationAgent
    index().on(t.inboundIntegrationId),
  ],
);
