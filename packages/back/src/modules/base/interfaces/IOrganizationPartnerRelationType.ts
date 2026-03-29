export const DataOrganizationPartnerRelationType = [
  "TOKEN_OWNER",
  "TOKEN_USER",
] as const;
export type IOrganizationPartnerRelationType =
  (typeof DataOrganizationPartnerRelationType)[number];
