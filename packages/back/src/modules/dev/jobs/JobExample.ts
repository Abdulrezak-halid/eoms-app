/**
 * @file: JobExample.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 23.02.2025
 * Last Modified Date: 23.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { IJobHandler } from "@m/core/interfaces/IJobHandler";

export const JobExample: IJobHandler<{ field1: number }> = {
  schema: z.object({ field1: z.number() }),
  cb: (c, p) => {
    c.logger.info({ field: p.field1 }, "Example Job");
  },
};
