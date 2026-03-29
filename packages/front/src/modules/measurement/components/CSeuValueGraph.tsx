import { IUnit, UtilUnit } from "common";
import { useCallback, useMemo, useState } from "react";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import { CChart } from "@m/base/components/CChart";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitAbbreviation } from "@m/base/hooks/useUnitAbbreviation";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMetricValueTab } from "./CMetricValueTab";

export function CSeuValueGraph({ seuId }: { seuId: string }) {
  const { t } = useTranslation();

  const range = useGlobalDatetimeRange();

  const [displayUnit, setDisplayUnit] = useState<IUnit>(() =>
    UtilUnit.getDefault("ENERGY"),
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

  const fetcherValues = useCallback(() => {
    return Api.GET("/u/measurement/seu/graph", {
      params: {
        query: { seuIds: seuId, ...range },
      },
    });
  }, [seuId, range]);

  const [data, load] = useLoader(fetcherValues);

  const middlewareGraphData = useCallback(
    (payload: InferApiGetResponse<"/u/measurement/seu/graph">) => {
      return [
        {
          name: t("value"),
          data: payload.series[0].values.map((d) => ({
            x: d.datetime,
            y: d.value * displayUnitMultiplier,
          })),
        },
      ];
    },
    [t, displayUnitMultiplier],
  );

  const graphData = useLoaderMiddleware(data, middlewareGraphData);

  return (
    <div className="space-y-4">
      <CMetricValueTab
        id={seuId}
        page="significant-energy-user"
        unitGroup="ENERGY"
        unit={displayUnit}
        onUnitChange={handleUnitChange}
        period={data.payload?.period}
        load={load}
      />

      <CAsyncLoader data={graphData}>
        {(payload) => (
          <CCard>
            <CChart
              series={payload}
              unitStr={displayUnitAbbr}
              hideLegends
              {...range}
            />
          </CCard>
        )}
      </CAsyncLoader>
    </div>
  );
}
