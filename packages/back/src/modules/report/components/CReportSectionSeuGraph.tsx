import { EApiFailCode } from "common";
import { FC } from "hono/jsx";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { ApiException } from "@m/core/exceptions/ApiException";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";
import { CReportChart } from "./CReportChart";

export const CReportSectionSeuGraph: FC<{
  c: IContextReport;
  seuIds?: string[];
  primary?: boolean;
  noGroup?: boolean;
}> = async ({ c, seuIds, primary, noGroup }) => {
  let ids: string[] = [];

  if (seuIds) {
    if (!seuIds.length) {
      throw new ApiException(EApiFailCode.BAD_REQUEST, "SEU id list is empty.");
    }
    ids = [...seuIds];
  } else if (primary) {
    const primaryRegressions = await ServiceAdvancedRegression.getAllResults(
      c,
      {
        primary: true,
        datetimeMin: c.config.datetimeStart,
        datetimeMax: c.config.datetimeEnd,
      },
    );
    ids = [
      ...new Set(primaryRegressions.flatMap((d) => (d.seu ? d.seu.id : []))),
    ];
  } else {
    throw new ApiException(
      EApiFailCode.BAD_REQUEST,
      "Provide either seuIds or set primary to true.",
    );
  }

  const names = await ServiceSeu.getNames(c);
  const { multiplier, defaultUnit } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  const records = await ServiceSeu.getGraphValues(c, {
    seuIds: ids,
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });

  const allSeriesData = ids.map((id) => {
    const targetRecord = records.series.find((s) => s.seu.id === id);
    const seuNameData = names.find((n) => n.id === id);

    return {
      resource: seuNameData?.energyResource as IEnergyResource | undefined,
      seriesItem: {
        name: seuNameData?.name ?? id,
        unit: defaultUnit,
        data: (targetRecord?.values ?? []).map((r) => ({
          x: r.datetime,
          y: r.value * multiplier,
        })),
      },
    };
  });

  type TSeriesItem = (typeof allSeriesData)[0]["seriesItem"];
  const charts: { resource?: IEnergyResource; series: TSeriesItem[] }[] = [];

  if (!noGroup) {
    const groupedMap = new Map<IEnergyResource | undefined, TSeriesItem[]>();

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
