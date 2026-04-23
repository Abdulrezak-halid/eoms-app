/**
 * @file: IOrganizationPlanFeature.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 26.03.2025
 * Last Modified Date: 26.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

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
  "RENERYO_AGENT",
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
