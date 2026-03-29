import { InferApiResponse } from "@m/base/api/Api";

export type IDtoOrganizationPartnerListItem = InferApiResponse<
  "/u/organization/partner/item",
  "get"
>["records"][number];
