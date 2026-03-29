import { z } from "@hono/zod-openapi";

import { SchemaRegressionStrategyConfig } from "../schemas/SchemaRegressionStrategyConfig";

export type IRegressionStrategyConfig = z.infer<
  typeof SchemaRegressionStrategyConfig
>;
