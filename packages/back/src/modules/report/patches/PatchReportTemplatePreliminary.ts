import { ServiceRuntimePatcher } from "@m/core/services/ServiceRuntimePatcher";

import { ServiceReportProfile } from "../services/ServiceReportProfile";

export const PatchReportTemplatePreliminary = ServiceRuntimePatcher.create(
  "DEV_REPORT_TEMPLATE_PRELIMINARY",
  async (c) => {
    await ServiceReportProfile.createCommon(c, {
      description: null,
      commonLabel: { type: "PLAIN", value: "ISO 50001" },
      content: {
        authorIds: [],
        title: { type: "TRANSLATED", value: "preliminaryAudit" },
        sections: [
          {
            title: { type: "TRANSLATED", value: "generalInformation" },
            content: {
              type: "TEXT",
              value: {
                type: "PLAIN",
                value: "",
              },
            },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "industrialPlantGeneralInformation",
            },
            content: { type: "HEADER" },
            depth: 1,
          },
          {
            title: { type: "TRANSLATED", value: "companyInfo" },
            content: { type: "COMPANY_INFO" },
            depth: 2,
          },
          {
            title: {
              type: "TRANSLATED",
              value: "industrialPlantGeneralInformation",
            },
            depth: 2,
            content: {
              type: "TABLE_HORIZONTAL",
              rows: [
                {
                  title: { type: "TRANSLATED", value: "establishmentYear" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "facilityLocation" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "facilityArea" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "mainProduction" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: {
                    type: "TRANSLATED",
                    value: "annualProductionCapacity",
                  },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: {
                    type: "TRANSLATED",
                    value: "actualAnnualProductionCapacity",
                  },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "rawMaterials" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "usedEnergyResource" },
                  value: { type: "PLAIN", value: "" },
                },
                {
                  title: { type: "TRANSLATED", value: "shifts" },
                  value: { type: "PLAIN", value: "" },
                },
              ],
            },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "industrialPlantInformation",
            },
            depth: 2,
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
                  title: { type: "TRANSLATED", value: "closedVolumes" },
                  value: { type: "PLAIN", value: "" },
                },
              ],
            },
          },
          {
            title: { type: "TRANSLATED", value: "purposeOfTheAudit" },
            depth: 1,
            content: { type: "TEXT" },
          },
          {
            title: { type: "TRANSLATED", value: "energyPolicies" },
            content: { type: "ENERGY_POLICIES" },
            depth: 1,
          },
          {
            title: { type: "TRANSLATED", value: "scopeAndLimits" },
            content: { type: "SCOPE_AND_LIMITS" },
            depth: 1,
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
            title: { type: "TRANSLATED", value: "energyConsumptionPieChart" },
            content: { type: "ENERGY_CONSUMPTION_PIE_CHART" },
            depth: 1,
          },

          {
            title: {
              type: "TRANSLATED",
              value: "departmentBasedProductionInformation",
            },
            content: { type: "HEADER" },
          },
          {
            title: { type: "TRANSLATED", value: "generalInformations" },
            depth: 1,
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  { title: { type: "PLAIN", value: "" }, valueType: "TEXT" },
                  { title: { type: "PLAIN", value: "" }, valueType: "TEXT" },
                ],
                rows: [
                  [
                    { type: "PLAIN", value: "" },
                    { type: "PLAIN", value: "" },
                  ],

                  [
                    { type: "PLAIN", value: "" },
                    { type: "PLAIN", value: "" },
                  ],
                ],
              },
            },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "annualProductionCapacitiesByProduct",
            },
            depth: 1,
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  {
                    title: { type: "TRANSLATED", value: "product" },
                    valueType: "TEXT",
                  },
                  {
                    title: { type: "TRANSLATED", value: "production" },
                    valueType: "NUMBER",
                  },
                  {
                    title: { type: "TRANSLATED", value: "unit" },
                    valueType: "TEXT",
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "annualProductionCapacity",
                    },
                    valueType: "NUMBER",
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "annualActualProduction",
                    },
                    valueType: "NUMBER",
                  },
                  {
                    title: { type: "TRANSLATED", value: "average" },
                    valueType: "NUMBER",
                  },
                  {
                    title: {
                      type: "TRANSLATED",
                      value: "averageCapacityUtilizationRate",
                    },
                    valueType: "NUMBER",
                  },
                ],
                rows: [
                  [
                    { type: "PLAIN", value: "" },
                    0,
                    { type: "PLAIN", value: "" },
                    0,
                    0,
                    0,
                    0,
                  ],
                ],
              },
            },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "evaluationOfProcessUnitsAndMainEnergyConsumingEquipment",
            },
            depth: 1,
            content: {
              type: "TABLE_VERTICAL",
              data: {
                headers: [
                  {
                    title: { type: "TRANSLATED", value: "name" },
                    valueType: "TEXT",
                  },
                  {
                    title: { type: "TRANSLATED", value: "meters" },
                    valueType: "NUMBER",
                  },
                  {
                    title: { type: "TRANSLATED", value: "drivers" },
                    valueType: "NUMBER",
                  },
                ],
                rows: [
                  [{ type: "PLAIN", value: "" }, 0, 0],
                  [{ type: "PLAIN", value: "" }, 0, 0],
                ],
              },
            },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "drivers",
            },
            content: {
              type: "PRIMARY_REGRESSION_DRIVER_LIST",
            },
          },
          {
            title: { type: "TRANSLATED", value: "analyses" },
            depth: 1,
            content: {
              type: "REGRESSION_ANALYSIS_TABLE",
            },
          },

          {
            title: {
              type: "TRANSLATED",
              value: "generalFindingsAndRecommendations",
            },
            content: { type: "HEADER" },
          },
          {
            title: {
              type: "TRANSLATED",
              value: "energyEfficiencySavingOpportunities",
            },
            depth: 1,
            content: {
              type: "ENERGY_SAVING_OPPORTUNITIES",
            },
          },
        ],
      },
    });
  },
);
