/**
 * @file: SchemaEIssueType.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.02.2025
 * Last Modified Date: 07.02.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";

import { DataIssueType } from "../interfaces/IIssueType";

export const SchemaEIssueType = z.enum(DataIssueType).openapi("IDtoEIssueType");
