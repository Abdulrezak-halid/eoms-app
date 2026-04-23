import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoCommunicationAndAwarenessPlanRequest = InferApiRequest<
  "/u/support/communication-awareness-plan/item",
  "post"
>;

export type IDtoCommunicationAndAwarenessPlanResponse = InferApiResponse<
  "/u/support/communication-awareness-plan/item/{id}",
  "get"
>;
