import { z } from "@hono/zod-openapi";

import { DataTrainingCategory } from "../interfaces/ITrainingCategory";

export const SchemaETrainingCategory = z
  .enum(DataTrainingCategory)
  .openapi("IDtoETrainingCategory");
