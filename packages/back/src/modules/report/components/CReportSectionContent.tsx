import { EApiFailCode } from "common";
import { FC } from "hono/jsx";

import { ApiException } from "@m/core/exceptions/ApiException";

import { IContextReport } from "../interfaces/IContextReport";
import { IReportSection } from "../interfaces/IReportSection";
import { UtilDictionary } from "../utils/UtilDictionary";
import { CReportChart } from "./CReportChart";
import { CReportHeatmap } from "./CReportHeatmap";
import { CReportPieChart } from "./CReportPieChart";
import { CReportSectionActionPlan } from "./CReportSectionActionPlans";
import { CReportSectionCompanyInfo } from "./CReportSectionCompanyInfo";
import { CReportSectionCriticalOperationalParameters } from "./CReportSectionCriticalOperationalParameters";
import { CReportSectionEnergyConsumptionPieChart } from "./CReportSectionEnergyConsumptionPieChart";
import { CReportSectionEnergyPolicies } from "./CReportSectionEnergyPolicies";
import { CReportSectionEnergySavingOpportunuties } from "./CReportSectionEnergySavingOpportunuties";
import { CReportSectionMeterSliceGraph } from "./CReportSectionMeterSliceGraph";
import { CReportSectionPrimaryRegressionDriverList } from "./CReportSectionPrimaryRegressionDriverList";
import { CReportSectionRegressionAnalysisTable } from "./CReportSectionRegressionAnalysisTable";
import { CReportSectionRegressionResult } from "./CReportSectionRegressionResult";
import { CReportSectionScopeAndLimits } from "./CReportSectionScopeAndLimits";
import { CReportSectionSeuConsumptionTable } from "./CReportSectionSeuConsumptionTable";
import { CReportSectionSeuGraph } from "./CReportSectionSeuGraph";
import { CReportSectionSeuTotalConsumptionPieChart } from "./CReportSectionSeuTotalConsumptionPieChart";
import { CReportSectionTargets } from "./CReportSectionTargets";
import { CReportSectionTotalEnergyConsumptionCostTable } from "./CReportSectionTotalEnergyConsumptionCostTable";
import { CReportSectionMonthlyTotalEnergyConsumptionCostTable } from "./CReportSectionTotalMonthlyEnergyConsumptionCostTable";

export const CReportSectionContent: FC<{
  c: IContextReport;
  content: IReportSection["content"];
}> = async ({ c, content }) => {
  if (!content) {
    return <></>;
  }

  switch (content.type) {
    case "HEADER":
      return <p></p>;

    case "TEXT":
      return (
        <p>
          {content.value
            ? UtilDictionary.translateValue(c.i18n, content.value)
            : ""}
        </p>
      );

    case "TABLE_HORIZONTAL":
      if (!content.rows || content.rows.length < 0) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "There no row for the rendering.",
        );
      }
      return (
        <table class="table">
          <tbody>
            {content.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{UtilDictionary.translateValue(c.i18n, row.title)}</th>
                <td>{UtilDictionary.translateValue(c.i18n, row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "TABLE_VERTICAL":
      if (
        !content.data ||
        !content.data.headers.length ||
        !content.data.rows.length
      ) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Content must filled.",
        );
      }
      return (
        <table class="table">
          <thead>
            <tr>
              {content.data.headers.map((header) => (
                <th class={header.valueType === "NUMBER" ? "right" : ""}>
                  {UtilDictionary.translateValue(c.i18n, header.title)}{" "}
                  {header.unit
                    ? `(${UtilDictionary.translateUnit(c.i18n, header.unit)})`
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.data.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    class={typeof cell === "number" ? "right" : ""}
                  >
                    {typeof cell === "number"
                      ? cell
                      : UtilDictionary.translateValue(c.i18n, cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case "ENERGY_SAVING_OPPORTUNITIES":
      return <CReportSectionEnergySavingOpportunuties c={c} />;

    case "ACTION_PLANS":
      return <CReportSectionActionPlan c={c} />;

    case "COMPANY_INFO":
      return <CReportSectionCompanyInfo c={c} />;

    case "ENERGY_POLICIES":
      return <CReportSectionEnergyPolicies c={c} />;

    case "SCOPE_AND_LIMITS":
      return <CReportSectionScopeAndLimits c={c} />;

    case "CRITICAL_OPERATIONAL_PARAMETERS":
      return <CReportSectionCriticalOperationalParameters c={c} />;

    case "TARGETS":
      return <CReportSectionTargets c={c} />;

    case "CHART_CUSTOM":
      return <CReportChart c={c} data={content.data} />;

    case "HEATMAP_CUSTOM":
      return <CReportHeatmap data={content.data} />;

    case "PIE_CHART_CUSTOM":
      return <CReportPieChart c={c} data={content.data} />;

    case "SEU_GRAPH":
      return (
        <CReportSectionSeuGraph
          c={c}
          seuIds={content.seuIds}
          primary={content.primary}
          noGroup={content.noGroup}
        />
      );

    case "SEU_TOTAL_CONSUMPTION_PIE_CHART":
      return (
        <CReportSectionSeuTotalConsumptionPieChart
          c={c}
          seuIds={content.seuIds}
          primary={content.primary}
          noGroup={content.noGroup}
        />
      );

    case "SEU_CONSUMPTION_TABLE":
      return (
        <CReportSectionSeuConsumptionTable
          c={c}
          seuIds={content.seuIds}
          primary={content.primary}
        />
      );

    case "TOTAL_MONTHLY_ENERGY_CONSUMPTION_COST_TABLE":
      return <CReportSectionMonthlyTotalEnergyConsumptionCostTable c={c} />;

    case "METER_SLICE_GRAPH":
      if (!content.sliceIds || !content.sliceIds.length) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Slice ids are missing",
        );
      }
      return (
        <CReportSectionMeterSliceGraph
          c={c}
          sliceIds={content.sliceIds}
          noGroup={content.noGroup}
        />
      );

    case "REGRESSION_RESULT":
      if (!content.resultId) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Result id is missing",
        );
      }
      return (
        <CReportSectionRegressionResult c={c} resultId={content.resultId} />
      );

    case "REGRESSION_ANALYSIS_TABLE":
      return (
        <CReportSectionRegressionAnalysisTable
          c={c}
          primary={content.primary}
        />
      );

    case "PRIMARY_REGRESSION_DRIVER_LIST":
      return <CReportSectionPrimaryRegressionDriverList c={c} />;

    case "TOTAL_ENERGY_CONSUMPTION_COST_TABLE":
      return <CReportSectionTotalEnergyConsumptionCostTable c={c} />;

    case "ENERGY_CONSUMPTION_PIE_CHART":
      return <CReportSectionEnergyConsumptionPieChart c={c} />;

    default:
      return <></>;
  }
};
