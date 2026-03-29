import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoCorrelationCommitRequest = InferApiRequest<
  "/u/analysis/correlation/commit",
  "post"
>;

export type IDtoCorrelationResults = InferApiResponse<
  "/u/analysis/correlation/results",
  "get"
>;

export type IDtoCorrelationResultItem =
  IDtoCorrelationResults["records"][number];

export type IDtoCorrelationValues = InferApiResponse<
  "/u/analysis/correlation/values/{resultId}",
  "get"
>["result"];

export type IDtoRegressionCommitRequest = InferApiRequest<
  "/u/analysis/linear-regression/commit",
  "post"
>;

export type IDtoRegressionResultItem = InferApiResponse<
  "/u/analysis/linear-regression/results",
  "get"
>[number];

export type IDtoRegressionValues = InferApiResponse<
  "/u/analysis/linear-regression/values/{resultId}",
  "get"
>["result"];
