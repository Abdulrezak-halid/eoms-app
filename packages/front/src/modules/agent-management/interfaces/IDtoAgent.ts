import { InferApiResponse } from "@m/base/api/Api";

export type IDtoAgentResponse = InferApiResponse<
  "/u/agent/assigned-items",
  "get"
>["records"][number];
