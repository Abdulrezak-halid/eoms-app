import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoWorkflowRequest = InferApiRequest<
  "/u/internal-audit/workflow/item",
  "post"
>;

export type IDtoWorkflowResponse = InferApiResponse<
  "/u/internal-audit/workflow/item/{id}",
  "get"
>;
