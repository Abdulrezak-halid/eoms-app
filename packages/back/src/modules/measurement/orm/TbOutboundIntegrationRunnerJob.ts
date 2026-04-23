import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { TbOrganization } from "@m/base/orm/TbOrganization";
import { TbJob } from "@m/core/orm/TbJob";

import { TbOutboundIntegration } from "./TbOutboundIntegration";

export const TbOutboundIntegrationRunnerJob = pgTable(
  "tb_measurement_outbound_integration_runner_jobs",
  {
    orgId: uuid()
      .notNull()
      .references(() => TbOrganization.id),
    subjectId: uuid()
      .notNull()
      .references(() => TbOutboundIntegration.id),
    jobId: uuid()
      .notNull()
      .references(() => TbJob.id),
  },
  (t) => [
    uniqueIndex().on(t.orgId, t.subjectId, t.jobId),

    // jobId: JobOutboundIntegrationRunner
    index().on(t.jobId),
  ],
);
