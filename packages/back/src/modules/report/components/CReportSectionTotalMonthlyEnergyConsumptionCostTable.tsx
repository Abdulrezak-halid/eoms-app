import { FC } from "hono/jsx";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";

import { IContextReport } from "../interfaces/IContextReport";
import { ServiceReportSectionData } from "../services/ServiceReportSectionData";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";

export const CReportSectionMonthlyTotalEnergyConsumptionCostTable: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const data = await ServiceReportSectionData.getConsumptionCostValuesMonthly(
    c,
    c.config.datetimeStart,
    c.config.datetimeEnd,
  );

  const availableResources = Array.from(
    new Set(
      data.flatMap((d) => Object.keys(d.energyResources) as IEnergyResource[]),
    ),
  );

  const { multiplier, abbr } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  const resources = availableResources.map((res) =>
    UtilDictionary.translateEnergyResource(c.i18n, res),
  );

  return (
    <table class="table">
      <thead>
        <tr>
          <th></th>
          {resources.map((resource) => (
            <th colspan={2}>{resource}</th>
          ))}
          <th colspan={2}>{c.i18n.t("total")}</th>
        </tr>
        <tr>
          <th>{c.i18n.t("months")}</th>
          {resources.map(() => (
            <>
              <th class="right">{c.i18n.t("consumption")}</th>
              <th class="right">{c.i18n.t("cost")}</th>
            </>
          ))}
          <th class="right">{c.i18n.t("consumption")}</th>
          <th class="right">{c.i18n.t("cost")}</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ energyResources, datetime }) => {
          const totalConsumption = availableResources.reduce(
            (acc, res) => acc + (energyResources[res]?.consumption ?? 0),
            0,
          );
          const totalCost = availableResources.reduce(
            (acc, res) => acc + (energyResources[res]?.cost ?? 0),
            0,
          );

          return (
            <tr key={datetime}>
              <td s>
                {new Intl.DateTimeFormat(c.i18n.getLanguage(), {
                  year: "numeric",
                  month: "long",
                }).format(new Date(datetime))}
              </td>
              {availableResources.map((resource) => (
                <>
                  <td>
                    {energyResources[resource]?.consumption
                      ? `${(energyResources[resource].consumption * multiplier).toFixed(2)} ${abbr}`
                      : "-"}
                  </td>
                  <td class="right">
                    {(energyResources[resource]?.cost ?? 0).toFixed(2)}
                  </td>
                </>
              ))}
              <td class="right">
                {totalConsumption > 0
                  ? `${(totalConsumption * multiplier).toFixed(2)} ${abbr}`
                  : "-"}
              </td>
              <td class="right">{totalCost.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
