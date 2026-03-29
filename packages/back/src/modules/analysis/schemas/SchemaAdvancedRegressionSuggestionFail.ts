import { z } from "zod";

import { DataAdvancedRegressionSuggestionFail } from "../interfaces/IAdvancedRegressionSuggestionFail";

export const SchemaAdvancedRegressionSuggestionFail = z
  .enum(DataAdvancedRegressionSuggestionFail)
  .openapi("IDtoEAdvancedRegressionSuggestionFail");
