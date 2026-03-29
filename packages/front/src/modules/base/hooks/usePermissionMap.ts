import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";
import { useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

export interface IPermissionInfo {
  title: string;
  description: string;
  orgPlanFeature?: IDtoEOrganizationPlanFeature;
}

export function usePermissionMap() {
  const { t } = useTranslation();

  return useMemo(
    (): Record<IDtoEPermission, IPermissionInfo | null> => ({
      ["/"]: {
        title: t("all"),
        description: t("allPermissionDescriptionMsg"),
      },

      // Dashboard ----------------------------------------------------
      ["/DASHBOARD/WIDGET/EDIT"]: {
        title: t("editDashboardWidgets"),
        description: t("permDescEditDashboardWidgets"),
      },

      // Base ----------------------------------------------------
      ["/BASE/USER"]: {
        title: t("users"),
        description: t("userPermissionDescriptionMsg"),
        orgPlanFeature: "USER_MANAGEMENT",
      },
      ["/BASE/DEPARTMENT"]: {
        title: t("departments"),
        description: t("basePermissionDescriptionMsg"),
        // No orgPlanFeature
      },
      ["/BASE/USER_TOKEN"]: {
        title: t("userTokens"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "USER_TOKEN",
      },
      ["/BASE/ORGANIZATION_PARTNER"]: {
        title: t("organizationPartners"),
        description: t("baseOrganizationPartnerMsg"),
        orgPlanFeature: "ORGANIZATION_PARTNER",
      },

      // Analysis ----------------------------------------------------
      ["/ANALYSIS"]: {
        title: t("analyses"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "ANALYSES",
      },

      // Commitment ----------------------------------------------------
      ["/COMMITMENT"]: {
        title: t("commitment"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "ISO50001",
      },

      // Internal Audit ----------------------------------------------------
      ["/INTERNAL_AUDIT"]: {
        title: t("internalAudit"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "ISO50001",
      },

      // Measurement ----------------------------------------------------
      ["/MEASUREMENT"]: {
        title: t("measurements"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "MEASUREMENT",
      },

      // Planning ----------------------------------------------------
      ["/PLANNING"]: {
        title: t("planning"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "ISO50001",
      },

      // Product Base ----------------------------------------------------
      ["/PRODUCT"]: {
        title: t("products"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "PRODUCT",
      },

      // Support ----------------------------------------------------
      ["/SUPPORT"]: {
        title: t("supportingOperations"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "ISO50001",
      },

      // Agent ----------------------------------------------------
      ["/AGENT"]: {
        title: t("agentManagement"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "eoms_AGENT",
      },

      // Report -------------------------------------------------
      ["/REPORT"]: {
        title: t("report"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "REPORT",
      },

      // DMS ----------------------------------------------------
      ["/DMS/QDMS_INTEGRATION"]: {
        title: t("qdmsLong"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "QDMS",
      },

      // Supply Chain ---------------------------------------------
      ["/SUPPLY_CHAIN"]: {
        title: t("supplyChain"),
        description: t("basePermissionDescriptionMsg"),
        orgPlanFeature: "SUPPLY_CHAIN",
      },
    }),
    [t],
  );
}
