import {
  IDtoEOrganizationPlanFeature,
  IDtoEPermission,
} from "common/build-api-schema";
import {
  Activity,
  Briefcase,
  CalendarCheck,
  FileText,
  Files,
  Gauge,
  Handshake,
  ListChecks,
  Network,
  Settings,
  ShieldCheck,
  Terminal,
  TextCursorInput,
} from "lucide-react";
import { useMemo } from "react";

import { IconType } from "@m/core/components/CIcon";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IRoutePath } from "@m/core/interfaces/IRoutePath";

export function useNavData() {
  const { t } = useTranslation();

  return useMemo<
    {
      icon: IconType;
      label: string;
      list: readonly {
        label: string;
        path: IRoutePath;
        highlightPath?: string;
        permission?: IDtoEPermission;
        orgPlanFeature?: IDtoEOrganizationPlanFeature;
      }[];
    }[]
  >(
    () => [
      {
        icon: Gauge,
        label: t("measurements"),
        list: [
          {
            label: t("metrics"),
            path: "/measurements/metric",
            permission: "/MEASUREMENT",
            orgPlanFeature: "MEASUREMENT",
          },
          {
            label: t("meters"),
            path: "/measurements/meter",
            permission: "/MEASUREMENT",
            orgPlanFeature: "MEASUREMENT",
          },
          {
            label: t("integrations"),
            path: "/measurements/metric-integration/outbound",
            highlightPath: "/measurements/metric-integration",
            permission: "/MEASUREMENT",
            orgPlanFeature: "MEASUREMENT",
          },
          {
            label: t("significantEnergyUsers"),
            path: "/measurements/significant-energy-user",
            permission: "/MEASUREMENT",
            orgPlanFeature: "MEASUREMENT",
          },
        ],
      },

      {
        icon: Activity,
        label: t("analyses"),
        list: [
          {
            label: t("energyPerformanceIndicators"),
            path: "/analysis/enpi",
            permission: "/ANALYSIS",
            orgPlanFeature: "ANALYSES",
          },
          {
            label: t("exploratoryAnalysis"),
            path: "/analysis/exploratory-analyses/correlation",
            highlightPath: "/analysis/exploratory-analyses",
            permission: "/ANALYSIS",
            orgPlanFeature: "ANALYSES",
          },
          {
            label: t("regressionAnalysis"),
            path: "/analysis/advanced-regression",
            permission: "/ANALYSIS",
            orgPlanFeature: "ANALYSES",
          },
          {
            label: t("dataViews"),
            path: "/analyses/data-view/profile",
            permission: "/ANALYSIS",
            orgPlanFeature: "ANALYSES",
          },
        ],
      },

      {
        icon: Handshake,
        label: t("commitment"),
        list: [
          {
            label: t("energyPolicies"),
            path: "/commitment/energy-policies",
            permission: "/COMMITMENT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("internalExternalConsiderations"),
            path: "/commitment/internal-external-considerations",
            permission: "/COMMITMENT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("needsAndExpectations"),
            path: "/commitment/needs-and-expectations",
            permission: "/COMMITMENT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("complianceObligation"),
            path: "/commitment/compliance-obligation",
            permission: "/COMMITMENT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("scopeAndLimits"),
            path: "/commitment/scope-and-limit",
            permission: "/COMMITMENT",
            orgPlanFeature: "ISO50001",
          },
        ],
      },

      {
        icon: CalendarCheck,
        label: t("planning"),
        list: [
          {
            label: t("swotAnalyses"),
            path: "/planning/risks/swot-analyses",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("forceFieldAnalyses"),
            path: "/planning/risks/force-field-analyses",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("gapAnalyses"),
            path: "/planning/risks/gap-analyses",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("energySavingOpportunities"),
            path: "/planning/energy-saving-opportunity",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("actionPlans"),
            path: "/planning/action-plan",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("designs"),
            path: "/planning/design",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("targets"),
            path: "/planning/target",
            permission: "/PLANNING",
            orgPlanFeature: "ISO50001",
          },
        ],
      },

      {
        icon: Briefcase,
        label: t("supportingOperations"),
        list: [
          {
            label: t("calibrationAndVerificationPlans"),
            path: "/supporting-operations/calibration-verification-plan",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("trainings"),
            path: "/supporting-operations/training",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("procurements"),
            path: "/supporting-operations/procurement",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("procurementProcedures"),
            path: "/supporting-operations/procurement-procedure",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("communicationAndAwarenessPlans"),
            path: "/supporting-operations/communication-awareness-plan",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("maintenanceActivities"),
            path: "/supporting-operations/maintenance-activity",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("measurementPlansEnpi"),
            path: "/supporting-operations/measurement-plan-enpi",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("measurementPlansCop"),
            path: "/supporting-operations/measurement-plan-cop",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("criticalOperationalParameters"),
            path: "/supporting-operations/critical-operational-parameter",
            permission: "/SUPPORT",
            orgPlanFeature: "ISO50001",
          },
        ],
      },

      {
        icon: ListChecks,
        label: t("internalAudit"),
        list: [
          {
            label: t("plans"),
            path: "/internal-audit/plan",
            permission: "/INTERNAL_AUDIT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("nonconformities"),
            path: "/internal-audit/nonconformity",
            permission: "/INTERNAL_AUDIT",
            orgPlanFeature: "ISO50001",
          },
          {
            label: t("workflows"),
            path: "/internal-audit/workflow",
            permission: "/INTERNAL_AUDIT",
            orgPlanFeature: "ISO50001",
          },
        ],
      },

      {
        icon: FileText,
        label: t("report"),
        list: [
          {
            label: t("reports"),
            path: "/report/item",
            permission: "/REPORT",
            orgPlanFeature: "REPORT",
          },
          {
            label: t("templates"),
            path: "/report/template",
            permission: "/REPORT",
            orgPlanFeature: "REPORT",
          },
          {
            label: t("attachments"),
            path: "/report/attachments",
            permission: "/REPORT",
            orgPlanFeature: "REPORT",
          },
        ],
      },

      {
        icon: Files,
        label: t("documentManagement"),
        list: [
          {
            label: t("qdmsLong"),
            path: "/dms/qdms-integration",
            permission: "/DMS/QDMS_INTEGRATION",
            orgPlanFeature: "QDMS",
          },
        ],
      },

      // {
      //   icon: Package,
      //   label: t("productManagement"),
      //   list: [
      //     {
      //       label: t("product"),
      //       path: "/product-base/product",
      //       permission: "/PRODUCT",
      //       orgPlanFeature: "PRODUCT",
      //     },
      //   ],
      // },

      // {
      //   icon: MemoryStick,
      //   label: t("agentManagement"),
      //   list: [
      //     {
      //       label: t("agents"),
      //       path: "/agent-management/agents",
      //       permission: "/AGENT",
      //       orgPlanFeature: "eoms_AGENT",
      //     },
      //   ],
      // },

      {
        icon: Network,
        label: t("supplyChain"),
        list: [
          {
            label: t("pipelines"),
            path: "/supply-chain/pipeline",
            permission: "/SUPPLY_CHAIN",
            orgPlanFeature: "SUPPLY_CHAIN",
          },
        ],
      },

      {
        icon: Settings,
        label: t("configuration"),
        list: [
          {
            label: t("users"),
            path: "/conf/user",
            permission: "/BASE/USER",
            orgPlanFeature: "USER_MANAGEMENT",
          },
          {
            label: t("departments"),
            path: "/configuration/departments",
            permission: "/BASE/DEPARTMENT",
            // No org plan feature
          },
          {
            label: t("myOrganization"),
            path: "/configuration/my-organization",
          },
          {
            label: t("partners"),
            path: "/configuration/organization-partners",
            permission: "/BASE/ORGANIZATION_PARTNER",
            orgPlanFeature: "ORGANIZATION_PARTNER",
          },
          {
            label: t("accessTokens"),
            path: "/configuration/access-token",
            permission: "/BASE/ACCESS_TOKEN",
            orgPlanFeature: "ACCESS_TOKEN",
          },
          {
            label: t("personalTokens"),
            path: "/my-profile/personal-tokens",
            permission: "/BASE/ACCESS_TOKEN",
            orgPlanFeature: "ACCESS_TOKEN",
          },
        ],
      },

      {
        icon: ShieldCheck,
        label: t("sysSystem"),
        list: [
          {
            label: t("sysOrganizations"),
            path: "/sys/organizations",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("users"),
            path: "/sys/users",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("sysRuntimePatcher"),
            path: "/sys/runtime-patcher",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("systemInfo"),
            path: "/sys/system-info",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("sysMaintenance"),
            path: "/sys/maintenance",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("issuesRequests"),
            path: "/sys/issues",
            orgPlanFeature: "SYSTEM",
          },
          {
            label: t("jobs"),
            path: "/sys/job",
            orgPlanFeature: "SYSTEM",
          },

          {
            label: t("agentRegistration"),
            path: "/sys/agent-registration",
            orgPlanFeature: "SYSTEM",
          },
        ],
      },

      ...(import.meta.env.VITE_DEV_PAGES
        ? ([
            {
              label: "Dev Document",
              icon: TextCursorInput,
              list: [
                {
                  label: "Special Components",
                  path: "/dev/component-doc-special",
                },
                {
                  label: "Guide",
                  path: "/crud-guide",
                },
                {
                  label: "Form Submit Example",
                  path: "/dev/form-example",
                },
                {
                  label: "Table Example",
                  path: "/dev/table",
                },
                {
                  label: "Charts",
                  path: "/dev/chart",
                },
                {
                  label: "Notification Balloons",
                  path: "/dev/notification-balloon",
                },
                {
                  label: "Toasts",
                  path: "/dev/toast",
                },
                {
                  label: "Modals",
                  path: "/dev/modal",
                },
                {
                  label: "Calendar",
                  path: "/dev/calendar",
                },
                {
                  label: "Map",
                  path: "/dev/map",
                },
                {
                  label: "Breakpoints",
                  path: "/dev/breakpints",
                },
                {
                  label: "API Loader Example",
                  path: "/dev/api-loader-example",
                },
              ],
            },
            {
              label: "Dev Check",
              icon: Terminal,
              list: [
                {
                  label: "Empty",
                  path: "/dev/empty",
                },
                {
                  label: "Component",
                  path: "/dev/components",
                },
                {
                  label: "Input State Test",
                  path: "/dev/input-state-test",
                },
                {
                  label: "Form",
                  path: "/dev/form",
                },
                {
                  label: "Chart",
                  path: "/dev/chart-check",
                },
                {
                  label: "Async Loader",
                  path: "/dev/async-loader",
                },
                {
                  label: "API",
                  path: "/dev/api",
                },
                {
                  label: "Websocket Handing",
                  path: "/dev/websocket-handling",
                },
                {
                  label: "Mock Integration Source",
                  path: "/dev/mock-integration-source",
                },
                {
                  label: "Markdown and Help Panel",
                  path: "/dev/markdown",
                },
                {
                  label: "Login",
                  path: "/dev/login",
                },
              ],
            },
          ] as const)
        : []),
    ],
    [t],
  );
}
