import { IDtoEEnergyResource } from "common/build-api-schema";
import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import { useEnergyResourceMap } from "@m/base/hooks/useEnergyResourceMap";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CPieChart } from "@m/core/components/CPieChart";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { IDatetimeRange } from "@m/core/interfaces/IDatetimeRange";

import { CMessageSelectDateRange } from "./CMessageSelectDateRange";

export function CReportSectionEnergyConsumptionPieChart({
  datetimeRange,
}: {
  datetimeRange?: IDatetimeRange;
}) {
  const fetcher = useCallback(async () => {
    if (!datetimeRange) {
      return;
    }

    return await Api.GET("/u/measurement/meter/item", {
      params: {
        query: datetimeRange,
      },
    });
  }, [datetimeRange]);

  const [data] = useLoader(fetcher);

  const { multiplier, unit } = useUnitInfo("ENERGY");

  const energyResourceMap = useEnergyResourceMap();

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      const meters = payload.records;

      const groupedByResource = meters.reduce(
        (acc, meter) => {
          const resource = meter.energyResource;
          if (!acc[resource]) {
            acc[resource] = {
              resource,
              consumption: 0,
              cost: 0,
            };
          }
          acc[resource].consumption += meter.consumption || 0;
          return acc;
        },
        {} as Record<
          IDtoEEnergyResource,
          {
            resource: IDtoEEnergyResource;
            consumption: number;
            cost: number;
          }
        >,
      );

      const list = Object.values(groupedByResource).filter(
        (item) => item.consumption > 0,
      );

      return list.map((item) => ({
        label: energyResourceMap[item.resource].label,
        value: item.consumption * multiplier,
      }));
    },
    [energyResourceMap, multiplier],
  );

  const pieData = useLoaderMiddleware(data, middleware);

  if (!datetimeRange) {
    return <CMessageSelectDateRange />;
  }

  return (
    <CAsyncLoader data={pieData}>
      {(payload) => (
        <CPieChart data={payload} unit={unit} disableInteractiveLegend />
      )}
    </CAsyncLoader>
  );
}
