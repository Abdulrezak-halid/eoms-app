/**
 * @file: SchemaJobName.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.01.2026
 * Last Modified Date: 04.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { jobNames } from "@/jobs";

export const SchemaEJobName = z.enum(jobNames).openapi("IDtoEJobName");
