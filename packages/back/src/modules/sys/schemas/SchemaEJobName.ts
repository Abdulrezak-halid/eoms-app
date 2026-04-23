import { z } from "@hono/zod-openapi";

import { jobNames } from "@/jobs";

export const SchemaEJobName = z.enum(jobNames).openapi("IDtoEJobName");
