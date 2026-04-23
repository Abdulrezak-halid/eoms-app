import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const PatchReportTemplateDev = ServiceRuntimePatcher.create(
  "DEV_REPORT_TEMPLATE_ALL_SECTIONS",
  async (c) => {
    await ServiceReportProfile.createCommon(c, {
      description: {
        type: "PLAIN",
        value: "Development template containing all report section types.",
      },
      commonLabel: { type: "PLAIN", value: "Dev" },
      content: {
        authorIds: [],
        title: { type: "PLAIN", value: "Dev All Component Test Report" },
        sections: [
          {
            title: { type: "PLAIN", value: "Header Section" },
            content: { type: "HEADER" },
          },
          {
            title: { type: "PLAIN", value: "Text Section" },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value: "This is a plain text area for general descriptions.",
              },
            },
          },

          {
            title: { type: "PLAIN", value: "Horizontal Table" },
            content: {
              type: "TABLE_HORIZONTAL",
              rows: [
                {
                  title: { type: "PLAIN", value: "Row 1 Title" },
                  value: { type: "PLAIN", value: "Row 1 Value" },
                },
                {
                  title: { type: "PLAIN", value: "Row 2 Title" },
                  value: { type: "PLAIN", value: "Row 2 Value" },
                },
              ],
            },
          },
          {
            title: { type: "PLAIN", value: "Vertical Table" },
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  {
                    title: { type: "PLAIN", value: "Item" },
                    valueType: "TEXT",
                  },
                  {
                    title: { type: "PLAIN", value: "Qty" },
                    valueType: "NUMBER",
                    unit: "PIECE",
                  },
                  {
                    title: { type: "PLAIN", value: "Price" },
                    valueType: "NUMBER",
                    unit: "PIECE",
                  },
                ],
                rows: [
                  [{ type: "PLAIN", value: "Widget A" }, 10, 50],
                  [{ type: "PLAIN", value: "Widget B" }, 5, 100],
                ],
              },
            },
          },

          {
            title: { type: "PLAIN", value: "Company Info" },
            content: { type: "COMPANY_INFO" },
          },
          {
            title: { type: "PLAIN", value: "Energy Policies" },
            content: { type: "ENERGY_POLICIES" },
          },
          {
            title: { type: "PLAIN", value: "Scope and Limits" },
            content: { type: "SCOPE_AND_LIMITS" },
          },

          {
            title: { type: "PLAIN", value: "Energy Saving Opportunities" },
            content: { type: "ENERGY_SAVING_OPPORTUNITIES" },
          },
          {
            title: { type: "PLAIN", value: "Action Plans" },
            content: { type: "ACTION_PLANS" },
          },
          {
            title: { type: "PLAIN", value: "Critical Operational Parameters" },
            content: { type: "CRITICAL_OPERATIONAL_PARAMETERS" },
          },
          {
            title: { type: "PLAIN", value: "Targets" },
            content: { type: "TARGETS" },
          },

          {
            title: { type: "PLAIN", value: "SEU Graph" },
            content: { type: "SEU_GRAPH", primary: true },
          },
          {
            title: { type: "PLAIN", value: "SEU Pie Chart" },
            content: { type: "SEU_TOTAL_CONSUMPTION_PIE_CHART", primary: true },
          },
          {
            title: { type: "PLAIN", value: "SEU Consumption Table" },
            content: { type: "SEU_CONSUMPTION_TABLE", primary: true },
          },
          {
            title: {
              type: "PLAIN",
              value: "Total Energy Consumption & Cost Table",
            },
            content: { type: "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" },
          },
          {
            title: { type: "PLAIN", value: "Energy Consumption Pie Chart" },
            content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
          },
          {
            title: { type: "PLAIN", value: "Monthly Total Consumption Cost" },
            content: { type: "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE" },
          },
          {
            title: { type: "PLAIN", value: "Meter Slice Graph" },
            content: { type: "METER_SLICE_GRAPH" },
          },

          // 7. Regression
          {
            title: { type: "PLAIN", value: "Primary Regression Driver List" },
            content: { type: "PRIMARY_REGRESSION_DRIVER_LIST" },
          },
          {
            title: { type: "PLAIN", value: "Regression Analysis Table" },
            content: { type: "REGRESSION_ANALYSIS_TABLE", primary: true },
          },
          {
            title: { type: "PLAIN", value: "Regression Result" },
            content: { type: "REGRESSION_RESULT" },
          },
        ],
      },
    });
  },
);
