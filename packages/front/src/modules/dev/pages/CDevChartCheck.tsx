import { UtilDate } from "common";
import { useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import {
  CChart,
  IChartSerieData,
  IChartSeries,
} from "@m/base/components/CChart";

export function CDevChartCheck() {
  const lineSeriesDaily = useMemo<IChartSeries>(
    () => [
      {
        name: "Data",
        data: new Array(30).fill(null).map((_, i) => {
          const date = new Date("2025-08-01T00:00:00+03:00");
          date.setDate(i + 1);
          return { x: UtilDate.objToIsoDatetime(date), y: Math.random() * 10 };
        }),
      },
    ],
    [],
  );

  const lineSeries2Days = useMemo<IChartSeries>(
    () => [
      {
        name: "Data",
        data: new Array(48).fill(null).map((_, i) => {
          const date = new Date("2025-08-01T00:00:00Z");
          date.setHours(i);
          return { x: UtilDate.objToIsoDatetime(date), y: Math.random() * 10 };
        }),
      },
    ],
    [],
  );

  const lineSeriesMinutely = useMemo<IChartSeries>(
    () => [
      {
        name: "Data",
        data: new Array(60).fill(null).map((_, i) => {
          const date = new Date("2025-08-01T00:00:00+03:00");
          date.setMinutes(i);
          return { x: UtilDate.objToIsoDatetime(date), y: Math.random() * 10 };
        }),
      },
    ],
    [],
  );

  const lineSeriesMissing = useMemo<IChartSeries>(
    () => [
      {
        name: "Data",
        data: new Array(10)
          .fill(null)
          .map((_, i) => {
            if (i === 5) {
              return null;
            }
            const date = new Date("2025-08-01T00:00:00+03:00");
            date.setDate(i + 1);
            return {
              x: UtilDate.objToIsoDatetime(date),
              y: Math.random() * 10,
            };
          })
          .filter(Boolean) as IChartSerieData,
      },
    ],
    [],
  );

  return (
    <CBody title="Dev - Charts Check">
      <div>Daily Data</div>
      <CChart series={lineSeriesDaily} />

      <div>Daily Data With Range</div>
      <CChart
        series={lineSeriesDaily}
        datetimeMin="2025-07-15T00:00:00Z"
        datetimeMax="2025-09-15T00:00:00Z"
      />

      <div>2 Days Data</div>
      <CChart series={lineSeries2Days} />

      <div>Minutely Data</div>
      <CChart series={lineSeriesMinutely} />

      <div>Missing Data</div>
      <CChart series={lineSeriesMissing} />

      <div>No Data</div>
      <CChart />
    </CBody>
  );
}
