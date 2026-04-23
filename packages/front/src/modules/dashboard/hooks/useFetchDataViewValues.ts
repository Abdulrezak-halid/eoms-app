import { UtilUnit } from "common";
import { useCallback } from "react";

import { Api, InferApiResponse } from "@m/base/api/Api";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

export function useFetchDataViewValues(
  dataViewId: string | undefined,
  range: IDatetimeRange,
) {
  const { t } = useTranslation();

  const fetcher = useCallback(() => {
    if (!dataViewId) {
      return undefined;
    }

    return Api.GET("/u/analysis/data-view/values/{profileId}", {
      params: {
        path: { profileId: dataViewId },
        query: range,
      },
    });
  }, [dataViewId, range]);

  const [data, load] = useLoader(fetcher);

  const middleware = useCallback(
    (
      payload: InferApiResponse<
        "/u/analysis/data-view/values/{profileId}",
        "get"
      >,
    ) => {
      const series = payload.series || [];

      // Check that all series have the same unit and get the unit abbreviation
      const firstUnit = series[0]?.unit;
      const allSameUnit = series.every((serie) => serie.unit === firstUnit);

      return {
        displayUnitAbbr:
          !allSameUnit || !firstUnit
            ? undefined
            : UtilUnit.getAbbreviation(UtilUnit.getDefault(firstUnit), t),

        series: series.map((serie) => {
          const unitDefault = UtilUnit.getDefault(serie.unit);
          const unitAbbr = UtilUnit.getAbbreviation(unitDefault, t);
          const multiplier = 1 / UtilUnit.getBaseMultiplier(unitDefault);

          return {
            name: `${serie.name} (${unitAbbr})`,
            data: serie.values.map((value) => ({
              x: value.datetime,
              y: value.value * multiplier,
            })),
          };
        }),
      };
    },
    [t],
  );

  const chartData = useLoaderMiddleware(data, middleware);

  return [chartData, load] as const;
}
