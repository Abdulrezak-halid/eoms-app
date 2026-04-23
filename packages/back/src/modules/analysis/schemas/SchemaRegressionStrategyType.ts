import { z } from "zod";

import { DataRegressionStrategyType } from "../interfaces/IRegressionStrategyType";

export const SchemaERegressionStrategyType = z
  .enum(DataRegressionStrategyType)
  .openapi("IDtoERegressionStrategyType");
