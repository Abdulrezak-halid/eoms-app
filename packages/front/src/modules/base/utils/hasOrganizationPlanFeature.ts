import { IDtoEOrganizationPlanFeature } from "common/build-api-schema";

export function hasOrganizationPlanFeature(
  userOrgPlanFeatures?: IDtoEOrganizationPlanFeature[],
  orgPlanFeature?: IDtoEOrganizationPlanFeature,
) {
  return !orgPlanFeature || userOrgPlanFeatures?.includes(orgPlanFeature);
}
