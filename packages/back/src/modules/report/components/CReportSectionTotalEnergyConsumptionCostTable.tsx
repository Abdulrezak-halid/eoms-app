import { FC } from "hono/jsx";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";

import { IContextReport } from "../interfaces/IContextReport";
import { ServiceReportSectionData } from "../services/ServiceReportSectionData";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";

export const CReportSectionTotalEnergyConsumptionCostTable: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const groupedMeters =
    await ServiceReportSectionData.getMetersGroupedByEnergyResource(
      c,
      c.config.datetimeStart,
      c.config.datetimeEnd,
    );

  const { multiplier, abbr } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  const rows = Object.entries(groupedMeters)
    .map(([resource, meters]) => {
      const totalConsumption =
        meters.reduce((sum, m) => sum + (m.consumption ?? 0), 0) ?? 0;

      return {
        resource,
        consumption: totalConsumption,
      };
    })
    .filter((row) => row.consumption > 0);

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("energyResource")}</th>
          <th class="right">{c.i18n.t("consumption")}</th>
          <th class="right">{c.i18n.t("cost")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={UtilDictionary.translateEnergyResource(
              c.i18n,
              row.resource as IEnergyResource,
            )}
          >
            <td>
              {UtilDictionary.translateEnergyResource(
                c.i18n,
                row.resource as IEnergyResource,
              )}
            </td>
            <td class="right">{`${(row.consumption * multiplier).toFixed(2)} ${abbr}`}</td>
            <td class="right">{0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
