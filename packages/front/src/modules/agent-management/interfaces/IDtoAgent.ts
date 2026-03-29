/**
 * @file: IDtoAgent.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.10.2025
 * Last Modified Date: 03.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { InferApiResponse } from "@m/base/api/Api";

export type IDtoAgentResponse = InferApiResponse<
  "/u/agent/assigned-items",
  "get"
>["records"][number];
