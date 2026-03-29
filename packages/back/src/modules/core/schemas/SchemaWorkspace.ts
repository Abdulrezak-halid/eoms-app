import { z } from "@hono/zod-openapi";
import { WORKSPACE_REGEX } from "common";

export const SchemaWorkspace = z.string().regex(WORKSPACE_REGEX);
