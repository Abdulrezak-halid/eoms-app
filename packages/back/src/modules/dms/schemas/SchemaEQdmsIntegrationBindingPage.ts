import { z } from "@hono/zod-openapi";

import { DataQdmsIntegrationBindingPage } from "../interfaces/IQdmsIntegrationBindingPage";

export const SchemaEQdmsIntegrationBindingPage = z
  .enum(DataQdmsIntegrationBindingPage)
  .openapi("IDtoEQdmsIntegrationBindingPage");
