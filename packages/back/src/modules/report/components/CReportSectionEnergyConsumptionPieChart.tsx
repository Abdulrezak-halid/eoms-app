import { IUnitGroup, UtilUnit } from "common";
import { FC } from "hono/jsx";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";

import { IContextReport } from "../interfaces/IContextReport";
import { ServiceReportSectionData } from "../services/ServiceReportSectionData";
import { UtilDictionary } from "../utils/UtilDictionary";
import { CReportPieChart } from "./CReportPieChart";

export const CReportSectionEnergyConsumptionPieChart: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const groupedMeters =
    await ServiceReportSectionData.getMetersGroupedByEnergyResource(
      c,
      c.config.datetimeStart,
      c.config.datetimeEnd,
    );

  const firstMetricGroup = Object.values(groupedMeters)[0]?.[0]?.metric
    .unitGroup as IUnitGroup;

  const unit = UtilUnit.getDefault(firstMetricGroup);
  const multiplier = 1 / UtilUnit.getBaseMultiplier(unit);

  const records = Object.entries(groupedMeters)
    .map(([resource, group]) => {
      const totalBase = group.reduce((sum, m) => {
        const defaultUnit = UtilUnit.getDefault(
          m.metric.unitGroup as IUnitGroup,
        );

        return (
          sum + (m.consumption ?? 0) * UtilUnit.getBaseMultiplier(defaultUnit)
        );
      }, 0);

      return {
        label: UtilDictionary.translateEnergyResource(
          c.i18n,
          resource as IEnergyResource,
        ),
        value: totalBase * multiplier,
      };
    })
    .filter((r) => r.value > 0);

  return (
    <CReportPieChart
      c={c}
      data={{
        unit,
        records,
      }}
    />
  );
};
