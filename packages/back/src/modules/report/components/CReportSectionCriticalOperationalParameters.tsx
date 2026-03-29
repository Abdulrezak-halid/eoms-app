import { FC } from "hono/jsx";

import { ServiceCriticalOperationalParameter } from "@m/support/services/ServiceCriticalOperationalParameter";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";

export const CReportSectionCriticalOperationalParameters: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const data = await ServiceCriticalOperationalParameter.getAll(c, c.orgId, {
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("significantEnergyUser")}</th>
          <th>{c.i18n.t("resource")}</th>
          <th>{c.i18n.t("parameter")}</th>
          <th>{c.i18n.t("unit")}</th>
          <th>{c.i18n.t("normalSettingValue")}</th>
          <th>{c.i18n.t("upperLimit")}</th>
          <th>{c.i18n.t("lowerLimit")}</th>
          <th>{c.i18n.t("measurementTool")}</th>
          <th>{c.i18n.t("accuracyCalibrationFrequency")}</th>
          <th>{c.i18n.t("valueResponsibleUser")}</th>
          <th>{c.i18n.t("deviationResponsibleUser")}</th>
          <th>{c.i18n.t("note")}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, idx) => (
          <tr key={idx}>
            <td>{d.seu.name}</td>
            <td>
              {UtilDictionary.translateEnergyResource(c.i18n, d.energyResource)}
            </td>
            <td>{d.parameter}</td>
            <td>{UtilDictionary.translateUnit(c.i18n, d.unit)}</td>
            <td>{d.normalSettingValue}</td>
            <td>{d.upperLimit}</td>
            <td>{d.lowerLimit}</td>
            <td>{d.measurementTool}</td>
            <td>{d.accuracyCalibrationFrequency}</td>
            <td>{d.valueResponsibleUser.displayName}</td>
            <td>{d.deviationResponsibleUser.displayName}</td>
            <td>{d.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
