import {
  InferApiGetResponse,
  InferApiRequest,
  InferApiResponse,
} from "@m/base/api/Api";

export type IDtoAgentRegistrationRequest = InferApiRequest<
  "/u/sys/agent/item",
  "post"
>;

export type IDtoAgentRegistrationListItem = InferApiResponse<
  "/u/sys/agent/item",
  "get"
>["records"][number];

export type IDtoAgentRegistrationResponse = InferApiResponse<
  "/u/sys/agent/item/{id}",
  "get"
>;

export type IDtoAgentRegistrationStatItem =
  InferApiGetResponse<"/u/sys/agent/item/{id}/stats">;
