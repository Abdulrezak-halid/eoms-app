import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoPipelineRequest = InferApiRequest<
  "/u/supply-chain/pipeline/item",
  "post"
>;

export type IDtoPipelineResponse = InferApiResponse<
  "/u/supply-chain/pipeline/item/{id}",
  "get"
>;

export type IDtoOperationResponse = InferApiResponse<
  "/u/supply-chain/pipeline/operation/item/{id}",
  "get"
>;

type IDtoOperationListResponse = InferApiResponse<
  "/u/supply-chain/pipeline/operation/item",
  "get"
>;

export type IDtoOperationRecord =
  IDtoOperationListResponse["records"][number];
