import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoEnergyPolicyResponse = InferApiResponse<
  "/u/commitment/energy-policy/item/{id}",
  "get"
>;

export type IDtoEnergyPolicyRequest = InferApiRequest<
  "/u/commitment/energy-policy/item",
  "post"
>;
