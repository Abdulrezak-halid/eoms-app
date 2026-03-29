/**
 * @file: hasOrganizationPlanFeature.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.04.2025
 * Last Modified Date: 06.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEOrganizationPlanFeature } from "common/build-api-schema";

export function hasOrganizationPlanFeature(
  userOrgPlanFeatures?: IDtoEOrganizationPlanFeature[],
  orgPlanFeature?: IDtoEOrganizationPlanFeature,
) {
  return !orgPlanFeature || userOrgPlanFeatures?.includes(orgPlanFeature);
}
