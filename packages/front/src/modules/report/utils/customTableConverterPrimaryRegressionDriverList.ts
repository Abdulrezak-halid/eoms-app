import { InferApiResponse } from "@m/base/api/Api";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getIntegrationPeriodTranslationKey } from "./getIntegrationPeriodTranslationKey";
import { getUnitGroupTranslationKey } from "./getUnitGroupTranslationKey";

type IDtoPrimaryRegressionDriverListItem = InferApiResponse<
  "/u/report/section-data/primary-regression-driver-list",
  "get"
>["records"][number];

export function customTableConverterPrimaryRegressionDriverList(
  records: IDtoPrimaryRegressionDriverListItem[],
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "name",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "unit",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "period",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "departments",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value: record.name,
      },
      {
        type: "TRANSLATED",
        value: getUnitGroupTranslationKey(record.unitGroup),
      },
      record.integrationPeriod
        ? {
            type: "TRANSLATED",
            value: getIntegrationPeriodTranslationKey(record.integrationPeriod),
          }
        : {
            type: "PLAIN",
            value: "-",
          },
      {
        type: "PLAIN",
        value: record.departmentNames.join(", "),
      },
    ]),
  };
}
