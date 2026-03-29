import { IDtoSeuResponse } from "@m/measurement/interfaces/IDtoSeu";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";

export function customTableConverterSeuConsumptionTable(
  records: IDtoSeuResponse[],
): IVerticalTableData {
  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "significantEnergyUser",
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
        unit: "ENERGY_KWH",
        title: {
          type: "TRANSLATED",
          value: "consumption",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "percentage",
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
        value: getEnergyResourceTranslationKey(record.energyResource),
      },
      Number((record.consumption ?? 0).toFixed(2)),
      Number((record.percentage ?? 0).toFixed(2)),
    ]),
  };
}
