/**
 * @file: SchemaEJobType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.07.2025
 * Last Modified Date: 04.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

export const SchemaEJobType = z
  .enum(["CRON", "ONE_TIME", "IMMEDIATE"])
  .openapi("IDtoEJobType");
