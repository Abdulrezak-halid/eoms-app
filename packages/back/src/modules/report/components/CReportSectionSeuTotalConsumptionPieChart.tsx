import { EApiFailCode, UtilUnit } from "common";
import { FC } from "hono/jsx";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { ApiException } from "@m/core/exceptions/ApiException";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { CReportPieChart } from "./CReportPieChart";

export const CReportSectionSeuTotalConsumptionPieChart: FC<{
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

  const seus = await ServiceSeu.getAll(c, {
    seuIds: ids,
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });

  const charts: {
    title?: string;
    records: { label: string; value: number }[];
  }[] = [];

  if (!noGroup) {
    const seusByResource = Object.groupBy(seus, (s) => s.energyResource);

    for (const [resource, items] of Object.entries(seusByResource)) {
      if (!items) {
        continue;
      }

      const resourceTitle = UtilDictionary.translateEnergyResource(
        c.i18n,
        items[0].energyResource || resource,
      );

      const records = items.map((s) => ({
        label: s.name,
        value: s.consumption || 0,
      }));

      charts.push({ title: resourceTitle, records });
    }
  } else {
    const records = seus.map((s) => ({
      label: s.name,
      value: s.consumption || 0,
    }));

    charts.push({ records });
  }

  return (
    <>
      {charts.map((chart, index) => (
        <CReportPieChart
          key={chart.title ?? `chart-all-${index}`}
          c={c}
          data={{
            title: chart.title,
            unit: UtilUnit.getDefault("ENERGY"),
            records: chart.records,
          }}
        />
      ))}
    </>
  );
};
