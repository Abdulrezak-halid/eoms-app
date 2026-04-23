import { IDtoAdvancedRegressionResultItem } from "@m/analysis/interfaces/IDtoRegressionAnalyses";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";

export function customTableConverterRegressionAnalysis(
  records: IDtoAdvancedRegressionResultItem[],
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
          value: "drivers",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "rsquared",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "rootMeanSquareError",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value:
          record.seu?.name ||
          record.slices.map((slice) => slice.name).join(", "),
      },
      {
        type: "PLAIN",
        value: record.drivers.map((d) => d.name).join(", "),
      },
      Number((record.rSquared ?? 0).toFixed(2)),
      Number((record.rmse ?? 0).toFixed(2)),
    ]),
  };
}
