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
