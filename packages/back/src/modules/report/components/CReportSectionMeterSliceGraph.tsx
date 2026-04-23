import { FC } from "hono/jsx";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { ServiceMeterSlice } from "@m/measurement/services/ServiceMeterSlice";
import { ServiceMetric } from "@m/measurement/services/ServiceMetric";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";
import { CReportChart } from "./CReportChart";

export const CReportSectionMeterSliceGraph: FC<{
  c: IContextReport;
  sliceIds: string[];
  noGroup?: boolean;
}> = async ({ c, sliceIds, noGroup }) => {
  const sliceDetails = await ServiceMeterSlice.getNames(c, { ids: sliceIds });
  const { multiplier, defaultUnit } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  const allSeriesData = await Promise.all(
    sliceDetails.map(async (detail) => {
      const values = await ServiceMetric.getGraphValues(c, detail.metricId, {
        datetimeMin: c.config.datetimeStart,
        datetimeMax: c.config.datetimeEnd,
      });

      const sliceValues = values.values.map((r) => ({
        x: r.datetime,
        y: r.value * detail.rate * multiplier,
      }));

      return {
        resource: detail.energyResource,
        seriesItem: {
          name: detail.name,
          unit: defaultUnit,
          data: sliceValues,
        },
      };
    }),
  );

  type TSeriesItem = (typeof allSeriesData)[0]["seriesItem"];
  const charts: { resource?: IEnergyResource; series: TSeriesItem[] }[] = [];

  if (!noGroup) {
    const groupedMap = new Map<IEnergyResource, TSeriesItem[]>();

    for (const item of allSeriesData) {
      const list = groupedMap.get(item.resource) ?? [];
      list.push(item.seriesItem);
      groupedMap.set(item.resource, list);
    }

    for (const [resource, series] of groupedMap.entries()) {
      charts.push({ resource, series });
    }
  } else {
    charts.push({
      series: allSeriesData.map((item) => item.seriesItem),
    });
  }

  return (
    <>
      {charts.map((d, index) => (
        <div key={d.resource ?? `chart-all-${index}`}>
          {d.resource && (
            <h3>
              {UtilDictionary.translateEnergyResource(c.i18n, d.resource)}
            </h3>
          )}
          <CReportChart
            c={c}
            data={{
              type: "line",
              series: d.series,
            }}
          />
        </div>
      ))}
    </>
  );
};
