import { z } from "@hono/zod-openapi";

import { DataDashboardWidgetType } from "../interfaces/IDashboardWidgetType";

export const SchemaEDashboardWidgetType = z
  .enum(DataDashboardWidgetType)
  .openapi("IDtoEDashboardWidgetType");
