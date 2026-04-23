import { IDtoEEnergyResource } from "common/build-api-schema";

import { InferApiResponse } from "@m/base/api/Api";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceCostTranslationKey } from "./getEnergyResourceCostTranslationKey";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";

type IMonthlyConsumptionResponse = InferApiResponse<
  "/u/report/section-data/consumption-cost-monthly",
  "get"
>;

export function customTableConverterMonthlyEnergyConsumption(
  payload: IMonthlyConsumptionResponse,
): IVerticalTableData {
  const energyResources = [
    ...new Set(payload.records.flatMap((d) => Object.keys(d.energyResources))),
  ] as IDtoEEnergyResource[];

  return {
    headers: [
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "monthlyTotalEnergyConsumptionCost",
        },
      },
      ...energyResources.flatMap((resource) => [
        {
          valueType: "NUMBER" as const,
          unit: "ENERGY_KWH" as const,
          title: {
            type: "TRANSLATED" as const,
            value: getEnergyResourceTranslationKey(resource),
          },
        },
        {
          valueType: "NUMBER" as const,
          title: {
            type: "TRANSLATED" as const,
            value: getEnergyResourceCostTranslationKey(resource),
          },
        },
      ]),
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
    rows: payload.records.map((record) => {
      const date = new Date(record.datetime);
      const monthAndYear = date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });

      let totalConsumption = 0;
      let totalCost = 0;

      for (const energyResource in record.energyResources) {
        const energyRecord =
          record.energyResources[energyResource as IDtoEEnergyResource]!;
        totalConsumption += energyRecord.consumption;
        totalCost += energyRecord.cost;
      }

      const resourceValues = energyResources.flatMap((resource) => {
        const energyResourceValues = record.energyResources[resource];
        return energyResourceValues
          ? [
              Number(energyResourceValues.consumption.toFixed(2)),
              Number(energyResourceValues.cost.toFixed(2)),
            ]
          : [0, 0];
      });

      return [
        {
          type: "PLAIN",
          value: monthAndYear,
        },
        ...resourceValues,
        Number(totalConsumption.toFixed(2)),
        Number(totalCost.toFixed(2)),
      ];
    }),
  };
}
