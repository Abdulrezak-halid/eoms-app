import { UtilUnit } from "common";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { CChart, IChartSeries } from "@m/base/components/CChart";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function CExploratoryAnalysesRegressionChartLoader({
  selectedResultId,
}: {
  selectedResultId: string;
}) {
  const { t } = useTranslation();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/analysis/linear-regression/values/{resultId}", {
      params: { path: { resultId: selectedResultId } },
    });
  }, [selectedResultId]);

  const [data] = useLoader(fetcher);

  const middleware = useCallback(
    (
      payload: IExtractAsyncData<typeof data>,
    ): {
      xAxisUnitAbbr: string;
      yAxisUnitAbbr: string;
      series: IChartSeries;
    } => {
      const selectedResult = payload.result;
      const values = selectedResult.values;

      const scatterData = values.map((dp) => ({
        x: dp.x,
        y: dp.y,
      }));

      const xValues = values.map((dp) => dp.x);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);

      const lineData = [
        {
          x: xMin,
          y: xMin * selectedResult.slope + selectedResult.intercept,
        },
        {
          x: xMax,
          y: xMax * selectedResult.slope + selectedResult.intercept,
        },
      ];

      const xAxisUnit = UtilUnit.getDefault(payload.result.driver.unitGroup);
      const yAxisUnit = UtilUnit.getDefault("ENERGY");

      return {
        xAxisUnitAbbr: UtilUnit.getAbbreviation(xAxisUnit, t),
        yAxisUnitAbbr: UtilUnit.getAbbreviation(yAxisUnit, t),
        series: [
          {
            name: t("regressionLine"),
            type: "line",
            color: "red",
            data: lineData,
          },
          {
            name: t("dataPoints"),
            type: "scatter",
            color: "blue",
            data: scatterData,
          },
        ],
      };
    },
    [t],
  );

  const processedData = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={processedData} className="w-full h-full">
      {(payload) => (
        <CChart
          series={payload.series}
          isXNumeric
          individualTooltipMode
          heightFull
          unitStr={payload.yAxisUnitAbbr}
          xAxisUnitStr={payload.xAxisUnitAbbr}
        />
      )}
    </CAsyncLoader>
  );
}

export function CExploratoryAnalysesRegressionChart({
  selectedResultId,
}: {
  selectedResultId?: string;
}) {
  return (
    <CCard className="h-96 @lg:h-full flex items-center justify-center">
      {selectedResultId ? (
        <CExploratoryAnalysesRegressionChartLoader
          selectedResultId={selectedResultId}
        />
      ) : (
        <CNoRecord />
      )}
    </CCard>
  );
}
