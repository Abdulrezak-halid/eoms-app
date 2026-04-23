import { z } from "@hono/zod-openapi";

import { DataIssueType } from "../interfaces/IIssueType";

export const SchemaEIssueType = z.enum(DataIssueType).openapi("IDtoEIssueType");
