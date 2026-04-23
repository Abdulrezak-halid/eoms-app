/**
 * @file: permissions.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.03.2025
 * Last Modified Date: 02.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

export const permissions = [
  "/", // Group

  "/ANALYSIS",

  "/BASE/USER",
  "/BASE/USER_TOKEN",
  "/BASE/DEPARTMENT",
  "/BASE/ACCESS_TOKEN",
  "/BASE/ORGANIZATION_PARTNER",

  "/COMMITMENT",

  "/DASHBOARD/WIDGET/EDIT",

  "/DMS/QDMS_INTEGRATION",

  "/INTERNAL_AUDIT",

  "/MEASUREMENT",

  "/PLANNING",

  "/PRODUCT",

  "/SUPPORT",

  "/AGENT",

  "/REPORT",

  "/SUPPLY_CHAIN",
] as const;
