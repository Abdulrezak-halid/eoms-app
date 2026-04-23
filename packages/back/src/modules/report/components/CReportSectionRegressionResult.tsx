import { FC } from "hono/jsx";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilReport } from "../utils/UtilReport";
import { CReportChart } from "./CReportChart";

export const CReportSectionRegressionResult: FC<{
  c: IContextReport;
  resultId: string;
}> = async ({ c, resultId }) => {
  const result = await ServiceAdvancedRegression.getResult(c, false, resultId);
  const { multiplier, defaultUnit } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  return (
    <>
      <CReportChart
        c={c}
        data={{
          type: "line",
          series: [
            {
              name: c.i18n.t("expected"),
              unit: defaultUnit,
              data: result.expectedValues.map((r) => ({
                x: r.datetime,
                y: r.value * multiplier,
              })),
            },
            {
              name: c.i18n.t("observed"),
              unit: defaultUnit,
              data: result.observedValues.map((r) => ({
                x: r.datetime,
                y: r.value * multiplier,
              })),
            },
            {
              name: c.i18n.t("difference"),
              unit: defaultUnit,
              data: result.differenceValues.map((r) => ({
                x: r.datetime,
                y: r.value * multiplier,
              })),
            },
          ],
        }}
      />

      <br />

      <CReportChart
        c={c}
        data={{
          type: "line",
          series: [
            {
              color: "red",
              name: c.i18n.t("cumulativeDifference"),
              unit: defaultUnit,
              data: result.cumulativeDifferenceValues.map((r) => ({
                x: r.datetime,
                y: r.value * multiplier,
              })),
            },
          ],
        }}
      />
    </>
  );
};
