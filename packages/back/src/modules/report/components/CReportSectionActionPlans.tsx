import { UtilDate } from "common";
import { FC } from "hono/jsx";

import { ServiceActionPlan } from "@m/planning/services/ServiceActionPlan";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportSectionActionPlan: FC<{ c: IContextReport }> = async ({
  c,
}) => {
  const actionPlans = await ServiceActionPlan.getAll(c, c.orgId, {
    datetimeMin: c.config.datetimeStart,
    datetimeMax: c.config.datetimeEnd,
  });
  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("actionPlan")}</th>
          <th>{c.i18n.t("reasonsForStatus")}</th>
          <th>{c.i18n.t("responsibleUser")}</th>
          <th>{c.i18n.t("startDate")}</th>
          <th>{c.i18n.t("targetIdentificationDate")}</th>
          <th>{c.i18n.t("actualIdentificationDate")}</th>
          <th>{c.i18n.t("actualSavingsVerifications")}</th>
        </tr>
      </thead>
      <tbody>
        {actionPlans.map((d, idx) => (
          <tr key={idx}>
            <td>{d.name}</td>
            <td>{d.reasonsForStatus}</td>
            <td>{d.responsibleUser.displayName}</td>
            <td>{UtilDate.formatLocalIsoDateToLocalDate(d.startDate)}</td>
            <td>
              {UtilDate.formatLocalIsoDateToLocalDate(
                d.targetIdentificationDate,
              )}
            </td>
            <td>
              {UtilDate.formatLocalIsoDateToLocalDate(
                d.actualIdentificationDate,
              )}
            </td>
            <td>{d.actualSavingsVerifications}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
