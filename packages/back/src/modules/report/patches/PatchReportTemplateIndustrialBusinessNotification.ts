import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const PatchReportTemplateIndustrialBusinessNotification =
  ServiceRuntimePatcher.create(
    "DEV_REPORT_TEMPLATE_INDUSTRIAL_BUSINESS_NOTIFICATION",
    async (c) => {
      await ServiceReportProfile.createCommon(c, {
        description: null,
        commonLabel: { type: "PLAIN", value: "ISO 50001" },
        content: {
          authorIds: [],
          title: {
            type: "TRANSLATED",
            value: "industrialBusinessNotification",
          },
          sections: [
            {
              title: {
                type: "TRANSLATED",
                value: "industrialBusinessInformations",
              },
              content: {
                type: "TABLE_HORIZONTAL",
                rows: [
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "industrialRegistryNumber",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "businessName" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "commissioningDate" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "mainSector" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "employeesNumber" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "businessManager" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "mailingAddress" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "phoneNumber" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "appointedEnergyManager",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: { type: "TRANSLATED", value: "certificateNo" },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "otherCertifiedEnergyManagers",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "energyManagementUnit",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "totalAnnualEnergyConsumption",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "closedVolumes",
                    },
                    value: { type: "PLAIN", value: "" },
                  },
                ],
              },
            },
            {
              title: { type: "TRANSLATED", value: "energyConsumptionAndCosts" },
              content: { type: "HEADER" },
            },
            {
              title: {
                type: "TRANSLATED",
                value: "tableEnergyConsumptionCost",
              },
              content: { type: "TOTAL_ENERGY_CONSUMPTION_COST_TABLE" },
              depth: 1,
            },
            {
              title: { type: "TRANSLATED", value: "energyConsumptionPieChart" },
              content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
              depth: 1,
            },
            {
              title: {
                type: "TRANSLATED",
                value: "monthlyTotalEnergyConsumptionCost",
              },
              content: { type: "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE" },
              depth: 1,
            },
          ],
        },
      });
    },
  );
