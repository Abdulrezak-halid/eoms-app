import { IDtoEnergySavingOpportunityResponse } from "@m/planning/interfaces/IDtoEnergySavingOpportunity";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";

export function customTableConverterEnergySavingOpportunities(
  records: IDtoEnergySavingOpportunityResponse[],
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "definition",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "significantEnergyUsers",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "investmentBudget",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "investmentApplicationPeriod",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "paybackMonth",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "responsibleUser",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value: record.name,
      },
      {
        type: "PLAIN",
        value: record.seus.map((seu) => seu.name).join(", "),
      },
      record.investmentBudget,
      record.investmentApplicationPeriodMonth,
      record.paybackMonth,
      {
        type: "PLAIN",
        value: record.responsibleUser.displayName,
      },
    ]),
  };
}
