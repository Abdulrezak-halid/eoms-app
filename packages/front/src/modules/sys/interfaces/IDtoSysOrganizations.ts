import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoSysOrganizationsRequest = InferApiRequest<
  "/u/sys/organization/item",
  "post"
>;

export type IDtoSysOrganizationsResponse = InferApiResponse<
  "/u/sys/organization/item/{id}",
  "get"
>;

export type IDtoSysOrganizationsGetAllItem = InferApiResponse<
  "/u/sys/organization/item",
  "get"
>["records"][number];
