import { UtilUnit } from "common";
import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { IExtractAsyncData } from "@m/core/components/CAsyncLoader";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";
import { IDtoSeuResponse } from "@m/measurement/interfaces/IDtoSeu";

export function useFetchSeuPiesGroupedByEnergyResource({
  primary,
  seuIds,
  noGroup,
  datetimeRange,
}: {
  primary?: boolean;
  seuIds?: string[];
  noGroup: boolean;
  datetimeRange?: IDatetimeRange;
}) {
  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    if (!primary && (!seuIds || seuIds.length === 0)) {
      return;
    }

    return await Api.GET("/u/measurement/seu/item", {
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
      const unit = UtilUnit.getDefault("ENERGY");
      const multiplier = 1 / UtilUnit.getBaseMultiplier(unit);

      const groupedByResource = payload.records.reduce(
        (acc, row) => {
          if (!acc[row.energyResource]) {
            acc[row.energyResource] = [];
          }
          acc[row.energyResource]!.push({
            ...row,
            consumption:
              row.consumption === null ? null : row.consumption * multiplier,
          });
          return acc;
        },
        {} as Peomsal<Record<IDtoEEnergyResource, IDtoSeuResponse[]>>,
      );

      // Casting is for string object key to energy resource.
      const groups = Object.entries(groupedByResource) as [
        IDtoEEnergyResource,
        IDtoSeuResponse[],
      ][];

      const grouped = groups.map(([energyResource, rows]) => ({
        energyResource,
        unit,
        pieData: rows.map((row) => ({
          label: row.name,
          value: row.consumption || 0,
        })),
      }));

      if (!noGroup) {
        return grouped;
      }

      return [
        {
          energyResource: undefined,
          unit: grouped[0]?.unit,
          pieData: grouped.flatMap((item) => item.pieData),
        },
      ];
    },
    [noGroup],
  );

  return useLoaderMiddleware(data, middleware);
}
