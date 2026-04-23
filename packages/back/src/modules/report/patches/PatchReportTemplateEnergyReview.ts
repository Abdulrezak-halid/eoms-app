import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const PatchReportTemplateEnergyReview = ServiceRuntimePatcher.create(
  "DEV_REPORT_TEMPLATE_ENERGY_REVIEW",
  async (c) => {
    await ServiceReportProfile.createCommon(c, {
      description: null,
      commonLabel: { type: "PLAIN", value: "ISO 50001" },
      content: {
        authorIds: [],
        title: { type: "TRANSLATED", value: "energyReview" },
        sections: [
          {
            title: { type: "TRANSLATED", value: "energyConsumptionData" },
            content: { type: "HEADER" },
          },
          {
            title: { type: "TRANSLATED", value: "seuGraph" },
            depth: 1,
            content: { type: "SEU_GRAPH", primary: true },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "tableSeuConsumption",
            },
            depth: 1,
            content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "seuTotalConsumptionPieChart",
            },
            depth: 1,
            content: { type: "SEU_TOTAL_CONSUMPTION_PIE_CHART", primary: true },
          },

          {
            title: { type: "TRANSLATED", value: "energyPerformanceIndicators" },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value: "",
                //  "Share in consumption by energy type %0.83 Consumption points with more than 'x' are designated as Significant Energy Users (SEUs) and monitored. By analyzing data from previous years, the following were identified 4of the SEUs 1are recognized as Major Energy Points (MEPs), and measurements and records are ongoing for these points. The share of the current MEPs in overall consumption %0.09is 'y'.",
              },
            },
          },
          {
            title: { type: "TRANSLATED", value: "regressionResult" },
            depth: 1,
            content: { type: "REGRESSION_RESULT" },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "criticalOperationalParameters",
            },
            content: { type: "CRITICAL_OPERATIONAL_PARAMETERS" },
          },
          {
            title: { type: "TRANSLATED", value: "actionPlans" },
            content: { type: "ACTION_PLANS" },
          },
          {
            title: { type: "TRANSLATED", value: "targets" },
            content: { type: "TARGETS" },
          },
        ],
      },
    });
  },
);
