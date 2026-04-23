import { FC } from "hono/jsx";

import { ServiceEnergySavingOpportunity } from "@m/planning/services/ServiceEnergySavingOpportunity";

import { IContextReport } from "../interfaces/IContextReport";

export const CReportSectionEnergySavingOpportunuties: FC<{
  c: IContextReport;
}> = async ({ c }) => {
  const opportunuties = await ServiceEnergySavingOpportunity.getAll(
    c,
    c.orgId,
    { datetimeMin: c.config.datetimeStart, datetimeMax: c.config.datetimeEnd },
  );
  return (
    <table class="table">
      <thead>
        <tr>
          <th>{c.i18n.t("definition")}</th>
          <th>{c.i18n.t("significantEnergyUsers")}</th>
          <th>{c.i18n.t("investmentBudget")}</th>
          <th>{c.i18n.t("investmentApplicationPeriod")}</th>
          <th>{c.i18n.t("paybackMonth")}</th>
          <th>{c.i18n.t("responsibleUser")}</th>
        </tr>
      </thead>
      <tbody>
        {opportunuties.map((d, index) => (
          <tr key={index}>
            <td>{d.name}</td>
            <td>
              {d.seus.map((seu, i) => (
                <div key={i}>{seu.name}</div>
              ))}
            </td>
            <td>{d.investmentBudget}</td>
            <td>
              {c.i18n.t("dynamicMonths", {
                month: d.investmentApplicationPeriodMonth,
              })}
            </td>
            <td>
              {c.i18n.t("dynamicMonths", {
                month: d.paybackMonth,
              })}
            </td>
            <td>{d.responsibleUser.displayName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
