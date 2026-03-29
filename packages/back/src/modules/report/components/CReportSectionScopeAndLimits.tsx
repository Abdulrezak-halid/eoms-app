import { FC } from "hono/jsx";

import { ServiceScopeAndLimit } from "@m/commitment/services/ServiceScopeAndLimit";

import { IContextReport } from "../interfaces/IContextReport";
import { UtilDictionary } from "../utils/UtilDictionary";

export const CReportSectionScopeAndLimits: FC<{ c: IContextReport }> = async ({
  c,
}) => {
  const scopeAndLimits = await ServiceScopeAndLimit.getAll(c, c.orgId, {
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });
  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("departments")}</th>
          <th>{c.i18n.t("excludedResources")}</th>
          <th>{c.i18n.t("excludedResourceReason")}</th>
        </tr>
      </thead>
      <tbody>
        {scopeAndLimits.map((d, i) => (
          <tr key={i}>
            <td>
              <ul>
                {d.departments.map((department, index) => (
                  <li key={index}>{department.name}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {d.excludedResources.map((resource, index) => (
                  <li key={index}>
                    {UtilDictionary.translateEnergyResource(c.i18n, resource)}
                  </li>
                ))}
              </ul>
            </td>
            <td>{d.excludedResourceReason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
