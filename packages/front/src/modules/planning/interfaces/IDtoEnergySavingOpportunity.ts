import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoEnergySavingOpportunityRequest = InferApiRequest<
  "/u/planning/energy-saving-opportunity/item",
  "post"
>;

export type IDtoEnergySavingOpportunityResponse = InferApiResponse<
  "/u/planning/energy-saving-opportunity/item/{id}",
  "get"
>;
