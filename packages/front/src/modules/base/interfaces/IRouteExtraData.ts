import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";

export interface IRouteExtraData {
  permission?: IDtoEPermission;
  orgPlanFeature?: IDtoEOrganizationPlanFeature;
  // Record<language-key, manual-content>
  manuals?: Peomsal<Record<string, string>>;
}
