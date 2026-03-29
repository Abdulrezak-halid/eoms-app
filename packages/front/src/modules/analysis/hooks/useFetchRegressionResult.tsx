import { UtilUnit } from "common";
import { useCallback } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { IChartSeries } from "@m/base/components/CChart";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

// Null means fetch latest result
export function useFetchRegressionResult(resultId: string | null | undefined) {
  const { t } = useTranslation();

  const fetcher = useCallback(async () => {
    if (resultId === undefined) {
      return;
    }

    if (resultId === null) {
      return await Api.GET("/u/analysis/advanced-regression/latest/result");
    }

    return await Api.GET("/u/analysis/advanced-regression/result/{resultId}", {
      params: { path: { resultId } },
    });
  }, [resultId]);

  const [data, load] = useLoader(fetcher);

  const middlewareChartData = useCallback(
    (
      payload: InferApiResponse<
        "/u/analysis/advanced-regression/result/{resultId}",
        "get"
      >,
    ) => {
      const unit = UtilUnit.getDefault("ENERGY");
      const multiplier = 1 / UtilUnit.getBaseMultiplier(unit);
      const abbr = UtilUnit.getAbbreviation(unit, t);

      const series: IChartSeries = [];

      if (payload.expectedValues.length > 0) {
        series.push({
          name: t("predicted"),
          data: payload.expectedValues.map((v) => ({
            x: v.datetime,
            y: v.value * multiplier,
          })),
        });
      }

      if (payload.observedValues.length > 0) {
        series.push({
          name: t("observed"),
          data: payload.observedValues.map((v) => ({
            x: v.datetime,
            y: v.value * multiplier,
          })),
        });
      }

      if (payload.differenceValues.length > 0) {
        series.push({
          name: t("difference"),
          data: payload.differenceValues.map((v) => ({
            x: v.datetime,
            y: v.value * multiplier,
          })),
        });
      }

      const cumulativeSeries: IChartSeries = [
        {
          name: t("cumulativeDifference"),
          data: payload.cumulativeDifferenceValues.map((record) => ({
            x: record.datetime,
            y: record.value * multiplier,
          })),
        },
      ];

      return { unit, unitAbbr: abbr, mainSeries: series, cumulativeSeries };
    },
    [t],
  );

  const chartData = useLoaderMiddleware(data, middlewareChartData);

  return [chartData, load] as const;
}
