import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { useMemo } from "react";

import { IDtoReportSectionType } from "../interfaces/IDtoReport";

// IDtoReportSectionType does not include custom dev types,
//   that's why final return type is Partial
export function useReportSectionDefaultTitleMap(): Partial<
  Record<IDtoReportSectionType, IDtoPlainOrTranslatableText>
> {
  return useMemo(
    () =>
      ({
        HEADER: undefined,
        TEXT: undefined,
        TABLE_HORIZONTAL: undefined,
        TABLE_VERTICAL: undefined,
        COMPANY_INFO: { type: "TRANSLATED", value: "companyInfo" },
        ENERGY_POLICIES: { type: "TRANSLATED", value: "energyPolicies" },
        SCOPE_AND_LIMITS: { type: "TRANSLATED", value: "scopeAndLimits" },
        ENERGY_SAVING_OPPORTUNITIES: {
          type: "TRANSLATED",
          value: "energySavingOpportunities",
        },
        ACTION_PLANS: { type: "TRANSLATED", value: "actionPlans" },
        TARGETS: { type: "TRANSLATED", value: "targets" },
        CRITICAL_OPERATIONAL_PARAMETERS: {
          type: "TRANSLATED",
          value: "criticalOperationalParameters",
        },
        METER_SLICE_GRAPH: {
          type: "TRANSLATED",
          value: "meterGraph",
        },
        SEU_GRAPH: { type: "TRANSLATED", value: "seuGraph" },
        REGRESSION_RESULT: { type: "TRANSLATED", value: "regressionResult" },
        SEU_TOTAL_CONSUMPTION_PIE_CHART: {
          type: "TRANSLATED",
          value: "seuTotalConsumptionPieChart",
        },
        ENERGY_CONSUMPTION_PIE_CHART: {
          type: "TRANSLATED",
          value: "energyConsumptionPieChart",
        },
        SEU_CONSUMPTION_TABLE: {
          type: "TRANSLATED",
          value: "tableSeuConsumption",
        },
        REGRESSION_ANALYSIS_TABLE: {
          type: "TRANSLATED",
          value: "tableRegressionAnalysis",
        },
        PRIMARY_REGRESSION_DRIVER_LIST: {
          type: "TRANSLATED",
          value: "drivers",
        },
        TOTAL_ENERGY_CONSUMPTION_COST_TABLE: {
          type: "TRANSLATED",
          value: "tableEnergyConsumptionCost",
        },
        TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE: {
          type: "TRANSLATED",
          value: "monthlyTotalEnergyConsumptionCost",
        },
      }) satisfies Record<
        IDtoReportSectionType,
        IDtoPlainOrTranslatableText | undefined
      >,
    [],
  );
}
