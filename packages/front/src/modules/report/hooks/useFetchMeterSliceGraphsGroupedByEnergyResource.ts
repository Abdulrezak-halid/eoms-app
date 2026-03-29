import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { IExtractAsyncData } from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

export function useFetchMeterSliceGraphsGroupedByEnergyResource({
  sliceIds,
  noGroup,
  datetimeRange,
}: {
  sliceIds: string[];
  noGroup: boolean;
  datetimeRange?: IDatetimeRange;
}) {
  const { abbr, multiplier } = useUnitInfo("ENERGY");

  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    if (!sliceIds.length) {
      return;
    }

    const resMeterSlices = await Api.GET("/u/measurement/meter/slice", {
      params: { query: { ...datetimeRange, noPercentage: "true" } },
    });
    if (!resMeterSlices.data) {
      return resMeterSlices;
    }

    const meterSlices = resMeterSlices.data.records.filter((d) =>
      sliceIds.includes(d.id),
    );

    const graphs = await Promise.all(
      meterSlices.map((d) =>
        Api.GET("/u/measurement/metric/item/{id}/graph", {
          params: { path: { id: d.metric.id }, query: datetimeRange },
        }),
      ),
    );

    const erroredResponse = graphs.find((d) => !d.data);
    if (erroredResponse) {
      return erroredResponse;
    }

    return {
      data: {
        meterSlices,
        graphs,
      },
    };
  }, [datetimeRange, sliceIds]);

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

      payload.meterSlices.forEach((slice, i) => {
        const energyResource: IDtoEEnergyResource = slice.energyResource;
        if (!groupedByEnergyResource.has(energyResource)) {
          groupedByEnergyResource.set(energyResource, []);
        }

        groupedByEnergyResource.get(energyResource)!.push({
          name: slice.name,
          data: payload.graphs[i].data!.values.map((record) => ({
            x: record.datetime,
            y: record.value * slice.rate * multiplier,
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
