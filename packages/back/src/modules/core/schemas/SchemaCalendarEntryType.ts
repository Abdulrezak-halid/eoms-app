import { z } from "@hono/zod-openapi";

import { DataCalendarEntryType } from "../interfaces/ICalendarEntryType";

export const SchemaECalendarEntryType = z
  .enum(DataCalendarEntryType)
  .openapi("IDtoECalendarEntryType");
