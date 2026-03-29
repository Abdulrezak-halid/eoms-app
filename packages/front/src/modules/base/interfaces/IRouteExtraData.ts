/**
 * @file: IRouteExtraData.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.07.2025
 * Last Modified Date: 05.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";

export interface IRouteExtraData {
  permission?: IDtoEPermission;
  orgPlanFeature?: IDtoEOrganizationPlanFeature;
  // Record<language-key, manual-content>
  manuals?: Partial<Record<string, string>>;
}
