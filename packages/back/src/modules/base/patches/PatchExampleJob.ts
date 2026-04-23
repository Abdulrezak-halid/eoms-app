import { ROOT_ORG_ID } from "@/constants";

import { ServiceJob } from "@m/core/services/ServiceJob";
import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

export const PatchExampleJob = ServiceRuntimePatcher.create(
  "EXAMPLE_JOB",
  async (c) => {
    await ServiceJob.schedule(c, ROOT_ORG_ID, {
      type: "CRON",
      // rule: "*/2 * * * * *",
      rule: "15 10 * * *",
      name: "EXAMPLE",
      param: { field1: 3 },
    });
  },
);
