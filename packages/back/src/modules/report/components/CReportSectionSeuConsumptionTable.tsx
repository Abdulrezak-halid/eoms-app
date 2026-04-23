import { EApiFailCode } from "common";
import { FC } from "hono/jsx";

import { ServiceAdvancedRegression } from "@m/analysis/services/ServiceAdvancedRegression";
import { ApiException } from "@m/core/exceptions/ApiException";
import { ServiceSeu } from "@m/measurement/services/ServiceSeu";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";
import { UtilReport } from "../utils/UtilReport";

export const CReportSectionSeuConsumptionTable: FC<{
  c: IContextReport;
  seuIds?: string[];
  primary?: boolean;
}> = async ({ c, seuIds, primary }) => {
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

  const { multiplier, abbr } = UtilReport.getUnitInfo(c.i18n, "ENERGY");

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("significantEnergyUser")}</th>
          <th>{c.i18n.t("resource")}</th>
          <th class="right">{c.i18n.t("consumption")}</th>
          <th class="right">{c.i18n.t("percentage")}</th>
        </tr>
      </thead>
      <tbody>
        {seus.map((d, idx) => (
          <tr key={idx}>
            <td>{d.name}</td>
            <td>
              {UtilDictionary.translateEnergyResource(c.i18n, d.energyResource)}
            </td>
            <td class="right">
              {d.consumption !== null
                ? `${(d.consumption * multiplier).toFixed(2)} ${abbr}`
                : ""}
            </td>
            <td class="right">
              {d.percentage !== null ? `${d.percentage.toFixed(1)}%` : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
