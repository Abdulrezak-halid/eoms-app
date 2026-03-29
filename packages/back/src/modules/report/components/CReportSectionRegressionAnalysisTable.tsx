import { FC } from "hono/jsx";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportSectionRegressionAnalysisTable: FC<{
  c: IContextReport;
  primary?: boolean;
}> = async ({ c, primary }) => {
  const records = await ServiceAdvancedRegression.getAllResults(c, {
    primary,
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("significantEnergyUser")}</th>
          <th>{c.i18n.t("driver")}</th>
          <th class="right">{c.i18n.t("rsquared")}</th>
          <th class="right">{c.i18n.t("rootMeanSquareError")}</th>
        </tr>
      </thead>
      <tbody>
        {records.map((d) => (
          <tr key={d.id}>
            <td>{d.seu ? d.seu.name : ""}</td>
            <td>{d.drivers.map((dr) => dr.name).join(", ")}</td>
            <td class="right">{d.rSquared?.toFixed(2)}</td>
            <td class="right">{d.rmse.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
