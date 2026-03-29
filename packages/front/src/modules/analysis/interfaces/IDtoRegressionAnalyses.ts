import {
  InferApiGetResponse,
  InferApiPostQuery,
  InferApiPostRequest,
} from "@m/base/api/Api";

export type IDtoAdvancedRegressionCommitRequest =
  InferApiPostRequest<"/u/analysis/advanced-regression/commit">;

export type IDtoAdvancedRegressionResults =
  InferApiGetResponse<"/u/analysis/advanced-regression/result">;
export type IDtoAdvancedRegressionResultItem =
  IDtoAdvancedRegressionResults["records"][number];

export type IDtoAdvancedRegressionValues =
  InferApiGetResponse<"/u/analysis/advanced-regression/result/{resultId}">;

export type IDtoAdvancedRegressionSuggestFormData = {
  body: InferApiPostRequest<"/u/analysis/advanced-regression/suggest">;
  query: InferApiPostQuery<"/u/analysis/advanced-regression/suggest">;
};

export type IDtoAdvancedRegressionSuggests =
  InferApiGetResponse<"/u/analysis/advanced-regression/suggest">;
export type IDtoAdvancedRegressionSuggestItem =
  IDtoAdvancedRegressionSuggests["records"][number];

export type IDtoAdvancedRegressionSuggestStatus =
  IDtoAdvancedRegressionSuggestItem["status"];

export type IDtoAdvancedRegressionFormData = {
  seu: IDtoAdvancedRegressionResultItem["seu"] | null;
  slices?: IDtoAdvancedRegressionResultItem["slices"];
  drivers: IDtoAdvancedRegressionResultItem["drivers"];
};
