import { z } from "@hono/zod-openapi";

import { DataDocumentApprovementStatus } from "@m/planning/interfaces/IDocumentApprovementStatus";

export const SchemaEDocumentApprovementStatus = z
  .enum(DataDocumentApprovementStatus)
  .openapi("IDtoEDocumentApprovementStatus");

