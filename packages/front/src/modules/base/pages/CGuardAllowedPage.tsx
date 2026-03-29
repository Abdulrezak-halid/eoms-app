/**
 * @file: CGuardAllowedPage.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.04.2025
 * Last Modified Date: 06.04.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";
import { ReactElement, useContext, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CNoPermission } from "@m/core/components/CNoPermission";
import { CPlanDisabledOp } from "@m/core/components/CPlanDisabledOp";

import { CBody } from "../components/CBody";
import { IBreadCrumb } from "../components/CBreadCrumbs";
import { ContextSession } from "../contexts/ContextSession";
import { hasOrganizationPlanFeature } from "../utils/hasOrganizationPlanFeature";
import { hasPermission } from "../utils/hasPermission";

export function CGuardAllowedPage({
  Component,
  permission,
  orgPlanFeature,
}: {
  Component: () => ReactElement;
  permission?: IDtoEPermission;
  orgPlanFeature?: IDtoEOrganizationPlanFeature;
}) {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("dashboard"), path: "/" }],
    [t],
  );

  const { session } = useContext(ContextSession);

  const noPlan = useMemo(
    () => !hasOrganizationPlanFeature(session.orgPlan.features, orgPlanFeature),
    [orgPlanFeature, session.orgPlan.features],
  );

  const noPermission = useMemo(
    () => !hasPermission(session.permissions, permission),
    [permission, session.permissions],
  );

  if (noPlan) {
    return (
      <CBody breadcrumbs={breadcrumbs}>
        <CPlanDisabledOp className="py-12" />
      </CBody>
    );
  }

  if (noPermission) {
    return (
      <CBody breadcrumbs={breadcrumbs}>
        <CNoPermission className="py-12" />
      </CBody>
    );
  }

  return <Component />;
}
