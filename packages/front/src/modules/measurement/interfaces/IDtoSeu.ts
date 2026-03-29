import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoSeuRequest = InferApiRequest<"/u/measurement/seu/item", "post">;

export type IDtoSeuResponse = InferApiResponse<
  "/u/measurement/seu/item/{id}",
  "get"
>;

export type IDtoSeuSuggestion = InferApiResponse<
  "/u/measurement/seu/suggest",
  "get"
>["records"][number];
