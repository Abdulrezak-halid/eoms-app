import { UtilUnit } from "common";
import { useCallback } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

export function useFetchMetricValues(
  metricId: string | undefined,
  range: IDatetimeRange,
) {
  const { t } = useTranslation();

  const fetcher = useCallback(() => {
    if (!metricId) {
      return undefined;
    }

    return Api.GET("/u/measurement/metric/item/{id}/graph", {
      params: {
        path: { id: metricId },
        query: range,
      },
    });
  }, [metricId, range]);

  const [data, load] = useLoader(fetcher);

  const multiplier =
    1 / UtilUnit.getBaseMultiplier(UtilUnit.getDefault("ENERGY"));

  const middleware = useCallback(
    (
      payload: InferApiResponse<"/u/measurement/metric/item/{id}/graph", "get">,
    ) => [
      {
        name: t("metricValues"),
        data: payload.values.map((record) => ({
          x: record.datetime,
          y: record.value * multiplier,
        })),
      },
    ],
    [multiplier, t],
  );

  const chartData = useLoaderMiddleware(data, middleware);

  return [chartData, load] as const;
}
