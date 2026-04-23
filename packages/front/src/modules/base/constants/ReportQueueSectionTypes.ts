export const REPORT_QUEUE_SECTION_META = {
  ENERGY_POLICIES: { labelKey: "energyPolicies" },
  SCOPE_AND_LIMITS: { labelKey: "scopeAndLimits" },
  ENERGY_SAVING_OPPORTUNITIES: { labelKey: "energySavingOpportunities" },
  TARGETS: { labelKey: "targets" },
  ACTION_PLANS: { labelKey: "actionPlans" },
  COMPANY_INFO: { labelKey: "companyInfo" },
  CRITICAL_OPERATIONAL_PARAMETERS: {
    labelKey: "criticalOperationalParameters",
  },
} as const;

export type IReportQueueSectionType = keyof typeof REPORT_QUEUE_SECTION_META;

export function isReportQueueSectionType(
  value: string,
): value is IReportQueueSectionType {
  return value in REPORT_QUEUE_SECTION_META;
}
