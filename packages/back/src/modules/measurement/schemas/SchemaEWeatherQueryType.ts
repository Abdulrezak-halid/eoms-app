import { z } from "@hono/zod-openapi";

import { DataWeatherQueryType } from "../interfaces/IWeatherQueryType";

export const SchemaEWeatherQueryType = z
  .enum(DataWeatherQueryType)
  .openapi("IDtoEWeatherQueryType");
