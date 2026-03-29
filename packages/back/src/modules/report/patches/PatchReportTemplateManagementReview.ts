import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const PatchReportTemplateManagementReview = ServiceRuntimePatcher.create(
  "DEV_REPORT_TEMPLATE_MANAGEMENT_REVIEW",
  async (c) => {
    await ServiceReportProfile.createCommon(c, {
      description: null,
      commonLabel: { type: "PLAIN", value: "ISO 50001" },
      content: {
        authorIds: [],
        title: { type: "TRANSLATED", value: "managementReview" },
        sections: [
          {
            title: { type: "TRANSLATED", value: "energyPolicies" },
            content: { type: "ENERGY_POLICIES" },
          },
          {
            title: { type: "TRANSLATED", value: "scopeAndLimits" },
            content: { type: "SCOPE_AND_LIMITS" },
          },
          {
            title: { type: "TRANSLATED", value: "energyConsumptionAndCosts" },
            content: { type: "HEADER" },
          },
          {
            title: { type: "TRANSLATED", value: "tableEnergyConsumptionCost" },
            content: { type: "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" },
            depth: 1,
          },
          {
            title: {
              type: "TRANSLATED",
              value: "energyConsumptionPieChart",
            },
            content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
            depth: 1,
          },
          {
            title: {
              type: "TRANSLATED",
              value: "energyEfficiencyInvestmentProjectsActionPlans",
            },
            content: { type: "ACTION_PLANS" },
          },
          {
            title: { type: "TRANSLATED", value: "energySavingPlans" },
            content: { type: "ENERGY_SAVING_OPPORTUNITIES" },
          },
          {
            title: { type: "TRANSLATED", value: "targets" },
            content: { type: "TARGETS" },
          },
          {
            title: { type: "TRANSLATED", value: "regressionResult" },
            content: { type: "REGRESSION_RESULT" },
          },
        ],
      },
    });
  },
);
