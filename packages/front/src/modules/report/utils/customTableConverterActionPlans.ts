import { UtilDate } from "common";

import { IDtoActionPlanResponse } from "@m/planning/interfaces/IDtoActionPlan";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";

export function customTableConverterActionPlans(
  records: IDtoActionPlanResponse[],
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "actionPlans",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "reasonsForStatus",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "responsibleUser",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "startDate",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "targetIdentificationDate",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "actualIdentificationDate",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "actualSavingsVerifications",
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
        value: record.reasonsForStatus,
      },
      {
        type: "PLAIN",
        value: record.responsibleUser.displayName,
      },
      {
        type: "PLAIN",
        value: UtilDate.formatLocalIsoDateToLocalDate(record.startDate),
      },
      {
        type: "PLAIN",
        value: UtilDate.formatLocalIsoDateToLocalDate(
          record.targetIdentificationDate,
        ),
      },
      {
        type: "PLAIN",
        value: UtilDate.formatLocalIsoDateToLocalDate(
          record.actualIdentificationDate,
        ),
      },
      {
        type: "PLAIN",
        value: record.actualSavingsVerifications,
      },
    ]),
  };
}
