import { z } from "@hono/zod-openapi";

import { IJobHandler } from "@m/core/interfaces/IJobHandler";

export const JobExample: IJobHandler<{ field1: number }> = {
  schema: z.object({ field1: z.number() }),
  cb: (c, p) => {
    c.logger.info({ field: p.field1 }, "Example Job");
  },
};
