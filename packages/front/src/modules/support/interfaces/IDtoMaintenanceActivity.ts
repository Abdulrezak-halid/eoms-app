import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoMaintenanceActivityRequest = InferApiRequest<
  "/u/support/maintenance-activity/item",
  "post"
>;

export type IDtoMaintenanceActivityResponse = InferApiResponse<
  "/u/support/maintenance-activity/item/{id}",
  "get"
>;
