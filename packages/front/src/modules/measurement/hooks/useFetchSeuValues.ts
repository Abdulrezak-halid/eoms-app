import { UtilUnit } from "common";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { IChartSeries } from "@m/base/components/CChart";
import { IExtractAsyncData } from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

export function useFetchSeuValues({
  primary,
  seuIds,
  datetimeRange,
}: {
  primary?: boolean;
  seuIds?: string[];
  datetimeRange?: IDatetimeRange;
}) {
  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    if (!primary && (!seuIds || seuIds.length === 0)) {
      return;
    }

    return await Api.GET("/u/measurement/seu/graph", {
      params: {
        query: {
          primary: primary ? "true" : undefined,
          seuIds: !primary && seuIds ? seuIds.join(",") : undefined,
          ...datetimeRange,
        },
      },
    });
  }, [datetimeRange, primary, seuIds]);

  const [data, load] = useLoader(fetcher);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>): IChartSeries => {
      const multiplier =
        1 / UtilUnit.getBaseMultiplier(UtilUnit.getDefault("ENERGY"));

      return payload.series.map((result) => ({
        name: result.seu.name,
        data: result.values.map((record) => ({
          x: record.datetime,
          y: record.value * multiplier,
        })),
      }));
    },
    [],
  );

  const chartData = useLoaderMiddleware(data, middleware);

  return [chartData, load] as const;
}
