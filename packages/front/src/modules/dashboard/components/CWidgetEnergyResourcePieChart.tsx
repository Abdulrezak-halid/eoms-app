import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CPieChart } from "@m/core/components/CPieChart";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";

export function CWidgetEnergyResourcePieChart() {
  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/meter/item", {
      params: {
        query: range,
      },
    });
  }, [range]);

  const [data] = useLoader(fetcher);

  const { multiplier, unit } = useUnitInfo("ENERGY");
  const energyResourceMap = useEnergyResourceMap();

  const middleware = useCallback(
    (payload: (typeof data)["payload"]) => {
      if (!payload) {
        return [];
      }

      const groupedByResource = payload.records.reduce(
        (acc, meter) => {
          const resource = meter.energyResource;
          if (!acc[resource]) {
            acc[resource] = 0;
          }
          acc[resource] += meter.consumption || 0;
          return acc;
        },
        {} as Record<IDtoEEnergyResource, number>,
      );

      return Object.entries(groupedByResource)
        .filter(([, consumption]) => consumption > 0)
        .map(([resource, consumption]) => ({
          label: energyResourceMap[resource as IDtoEEnergyResource].label,
          value: consumption * multiplier,
        }));
    },
    [energyResourceMap, multiplier],
  );

  const pieData = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={pieData} className="min-h-72 h-full">
      {(payload) => (
        <CPieChart data={payload} unit={unit} disableInteractiveLegend />
      )}
    </CAsyncLoader>
  );
}
