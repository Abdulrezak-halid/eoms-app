/**
 * @file: JobOutboundIntegrationRunner.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.07.2025
 * Last Modified Date: 09.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { eq } from "drizzle-orm";

import { IJobHandler } from "@m/core/interfaces/IJobHandler";

import { TbOutboundIntegrationRunnerJob } from "../orm/TbOutboundIntegrationRunnerJob";
import { ServiceOutboundIntegration } from "../services/ServiceOutboundIntegration";

export const JobOutboundIntegrationRunner: IJobHandler = {
  cb: async (c) => {
    const [jobDetail] = await c.db
      .select({ subjectId: TbOutboundIntegrationRunnerJob.subjectId })
      .from(TbOutboundIntegrationRunnerJob)
      .where(eq(TbOutboundIntegrationRunnerJob.jobId, c.jobId));

    if (!jobDetail) {
      throw new Error(
        "Metric outbound integration runner job cannot find job detail record.",
      );
    }

    await ServiceOutboundIntegration.runAndSaveValues(
      c,
      c.orgId,
      jobDetail.subjectId,
    );

    c.logger.info("Metric integration runner job executed.");
  },
};
