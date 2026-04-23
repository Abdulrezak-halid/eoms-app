import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { IExtractAsyncData } from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

export function useFetchSeuGraphsGroupedByEnergyResource({
  primary,
  seuIds,
  noGroup,
  datetimeRange,
}: {
  primary: boolean;
  seuIds: string[];
  noGroup: boolean;
  datetimeRange?: IDatetimeRange;
}) {
  const { abbr, multiplier } = useUnitInfo("ENERGY");

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

  const [data] = useLoader(fetcher);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      const groupedByEnergyResource = new Map<
        IDtoEEnergyResource,
        Array<{
          name: string;
          data: Array<{ x: string; y: number }>;
        }>
      >();

      payload.series.forEach((serie) => {
        const seu = serie.seu;
        const energyResource: IDtoEEnergyResource = seu.energyResource;
        if (!groupedByEnergyResource.has(energyResource)) {
          groupedByEnergyResource.set(energyResource, []);
        }

        groupedByEnergyResource.get(energyResource)!.push({
          name: seu.name,
          data: serie.values.map((record) => ({
            x: record.datetime,
            y: record.value * multiplier,
          })),
        });
      });

      const grouped = Array.from(groupedByEnergyResource.entries()).map(
        ([energyResource, series]) => ({
          energyResource,
          series,
          unit: abbr,
        }),
      );

      if (!noGroup) {
        return grouped;
      }

      return [
        {
          energyResource: undefined,
          series: grouped.flatMap((item) => item.series),
          unit: grouped[0]?.unit,
        },
      ];
    },
    [abbr, multiplier, noGroup],
  );

  return useLoaderMiddleware(data, middleware);
}
