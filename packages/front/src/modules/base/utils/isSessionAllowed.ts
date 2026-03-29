/**
 * @file: isSessionAllowed.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.04.2025
 * Last Modified Date: 06.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";

import { ISession } from "../contexts/ContextSession";
import { hasOrganizationPlanFeature } from "./hasOrganizationPlanFeature";
import { hasPermission } from "./hasPermission";

export function isSessionAllowed(
  session: ISession,
  permission?: IDtoEPermission,
  orgPlanFeature?: IDtoEOrganizationPlanFeature,
) {
  return (
    hasPermission(session.permissions, permission) &&
    hasOrganizationPlanFeature(session.orgPlan.features, orgPlanFeature)
  );
}
