import { FC } from "hono/jsx";

import { IContextReport } from "../interfaces/IContextReport";
import { ServiceReportSectionData } from "../services/ServiceReportSectionData";
import { UtilDictionary } from "../utils/UtilDictionary";

export const CReportSectionPrimaryRegressionDriverList: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const driverRows =
    await ServiceReportSectionData.getPrimaryRegressionDriverList(
      c,
      c.config.datetimeStart,
      c.config.datetimeEnd,
    );

  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("driver")}</th>
          <th>{c.i18n.t("unit")}</th>
          <th>{c.i18n.t("period")}</th>
          <th>{c.i18n.t("departments")}</th>
        </tr>
      </thead>
      <tbody>
        {driverRows.map((row, idx) => (
          <tr key={idx}>
            <td>{row.name}</td>

            <td>{UtilDictionary.translateUnitGroup(c.i18n, row.unitGroup)}</td>

            <td>
              {row.integrationPeriod
                ? UtilDictionary.translateIntegrationPeriod(
                    c.i18n,
                    row.integrationPeriod,
                  )
                : "-"}
            </td>

            <td>
              {}
              {row.departmentNames.map((depName, i) => (
                <div key={i}>{depName}</div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
