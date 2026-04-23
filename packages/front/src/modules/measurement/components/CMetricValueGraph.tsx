import { IUnit, IUnitGroup, UtilUnit } from "common";
import { IDtoMetricResource } from "common/build-api-schema";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CChart } from "@m/base/components/CChart";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { useLoaderMiddleware, useLoaderMulti } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderMetricResource } from "../utils/renderMetricResource";
import { CMetricValueTab } from "./CMetricValueTab";

export function CMetricValueGraph({ unitGroup }: { unitGroup: IUnitGroup }) {
  const { t } = useTranslation();
  const { id: metricId } = useParams<{ id: string }>();

  const range = useGlobalDatetimeRange();

  const [displayUnit, setDisplayUnit] = useState<IUnit>(
    UtilUnit.getDefault(unitGroup),
  );
  const handleUnitChange = useCallback((unit: IUnit | undefined) => {
    if (unit) {
      setDisplayUnit(unit);
    }
  }, []);
  const displayUnitMultiplier = useMemo(
    () => 1 / UtilUnit.getBaseMultiplier(displayUnit),
    [displayUnit],
  );
  const displayUnitAbbr = useUnitAbbreviation(displayUnit);

  const fetcher = useCallback(async () => {
    return {
      graph: await Api.GET("/u/measurement/metric/item/{id}/graph-resources", {
        params: {
          path: { id: metricId },
          query: range,
        },
      }),
      resource: await Api.GET("/u/measurement/metric/resources", {
        params: {
          query: { metricId },
        },
      }),
    };
  }, [metricId, range]);

  const [data, load] = useLoaderMulti(fetcher);

  const middlewareGraphData = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      if (!payload.resource.records) {
        return [];
      }

      const resourcesMap = new Map<string, IDtoMetricResource>();
      payload.resource.records.forEach((resource) => {
        resourcesMap.set(resource.id, resource);
      });

      const seriesMap = new Map<string, { x: string; y: number }[]>();

      payload.graph.values.forEach((value) => {
        if (!seriesMap.has(value.resourceId)) {
          seriesMap.set(value.resourceId, []);
        }
        seriesMap.get(value.resourceId)!.push({
          x: value.datetime,
          y: value.value * displayUnitMultiplier,
        });
      });

      return Array.from(seriesMap.entries()).map(([resourceId, seriesData]) => {
        const resource = resourcesMap.get(resourceId);
        const name = resource ? renderMetricResource(t, resource) : resourceId;

        return {
          name,
          data: seriesData,
        };
      });
    },
    [t, displayUnitMultiplier],
  );

  const graphData = useLoaderMiddleware(data, middlewareGraphData);

  return (
    <div className="space-y-4">
      <CMetricValueTab
        id={metricId}
        unitGroup={unitGroup}
        unit={displayUnit}
        onUnitChange={handleUnitChange}
        period={data.payload?.graph.period}
        load={load}
      />

      <CAsyncLoader data={graphData}>
        {(payload) => (
          <CCard>
            <CChart series={payload} unitStr={displayUnitAbbr} {...range} />
          </CCard>
        )}
      </CAsyncLoader>
    </div>
  );
}
