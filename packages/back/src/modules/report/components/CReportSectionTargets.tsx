import { FC } from "hono/jsx";

import { ServiceTarget } from "@m/planning/services/ServiceTarget";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";

export const CReportSectionTargets: FC<{ c: IContextReport }> = async ({
  c,
}) => {
  const target = await ServiceTarget.getAll(c, c.orgId, {
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });

  const { abbr, multiplier } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("year")}</th>
          <th>{c.i18n.t("resource")}</th>
          <th class="right">{c.i18n.t("percentage")}</th>
          <th class="right">{c.i18n.t("consumption")}</th>
        </tr>
      </thead>
      <tbody>
        {target.map((d, index) => (
          <tr key={index}>
            <td>{d.year}</td>
            <td>
              {UtilDictionary.translateEnergyResource(c.i18n, d.energyResource)}
            </td>
            <td class="right">{`${d.percentage.toFixed(1)}%`}</td>
            <td class="right">{`${(d.consumption * multiplier).toFixed(2)} ${abbr}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
