import { IDtoEEnergyResource } from "common/build-api-schema";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";

type IEnergyConsumptionCostRecord = {
  resource: IDtoEEnergyResource;
  consumption: number;
  cost: number;
};

export function customTableConverterEnergyConsumptionCostTable(
  records: IEnergyConsumptionCostRecord[],
): IVerticalTableData {
  return {
    headers: [
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
          value: "cost",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "TRANSLATED",
        value: getEnergyResourceTranslationKey(record.resource),
      },
      Number(record.consumption.toFixed(2)),
      Number(record.cost.toFixed(2)),
    ]),
  };
}
