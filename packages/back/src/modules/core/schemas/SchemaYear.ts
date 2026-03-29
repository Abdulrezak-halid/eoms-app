/**
 * @file: SchemaYear.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.03.2025
 * Last Modified Date: 21.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { MAX_YEAR, MIN_YEAR } from "common";

export const SchemaYear = z.number().min(MIN_YEAR).max(MAX_YEAR);
