/**
 * @file: SchemaWorkspace.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 16.11.2024
 * Last Modified Date: 02.01.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { z } from "@hono/zod-openapi";
import { WORKSPACE_REGEX } from "common";

export const SchemaWorkspace = z.string().regex(WORKSPACE_REGEX);
