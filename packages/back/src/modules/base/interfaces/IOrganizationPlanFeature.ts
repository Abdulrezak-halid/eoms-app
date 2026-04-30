
export const DataOrganizationPlanFeature = [
  // Modules
  "MEASUREMENT",
  "ANALYSES",
  "ISO50001",
  "PRODUCT",
  "SUPPLY_CHAIN",
  "REPORT",

  // Integrations
  "QDMS",
  "eoms_AGENT",
  "ACCESS_TOKEN",

  // Base
  "USER_MANAGEMENT",
  "USER_TOKEN",
  "SYSTEM",
  "ORGANIZATION_PARTNER",

  "UNCATEGORIZED",
] as const;

export type IOrganizationPlanFeature =
  (typeof DataOrganizationPlanFeature)[number];
