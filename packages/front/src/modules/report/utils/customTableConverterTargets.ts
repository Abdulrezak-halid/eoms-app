import { IDtoTargetResponse } from "@m/planning/interfaces/IDtoTarget";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";

export function customTableConverterTargets(
  records: IDtoTargetResponse[],
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "year",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "energyResource",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "percentage",
        },
      },
      {
        valueType: "NUMBER",
        unit: "ENERGY_KWH",
        title: {
          type: "TRANSLATED",
          value: "consumption",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value: record.year.toString(),
      },
      {
        type: "TRANSLATED",
        value: getEnergyResourceTranslationKey(record.energyResource),
      },
      record.percentage,
      record.consumption,
    ]),
  };
}
