import { IDtoCriticalOperationalParameterResponse } from "@m/support/interfaces/IDtoCriticalOperationalParameter";

import { IVerticalTableData } from "../interfaces/IVerticalTableData";
import { getEnergyResourceTranslationKey } from "./getEnergyResourceTranslationKey";
import { getUnitTranslationKey } from "./getUnitTranslationKey";

export function customTableConverterCriticalOperationalParameters(
  records: IDtoCriticalOperationalParameterResponse[],
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
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "parameter",
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
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "normalSettingValue",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "upperLimit",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "lowerLimit",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "measurementTool",
        },
      },
      {
        valueType: "NUMBER",
        title: {
          type: "TRANSLATED",
          value: "accuracyCalibrationFrequency",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "valueResponsibleUser",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "deviationResponsibleUser",
        },
      },
      {
        valueType: "TEXT",
        title: {
          type: "TRANSLATED",
          value: "note",
        },
      },
    ],
    rows: records.map((record) => [
      {
        type: "PLAIN",
        value: record.seu.name,
      },
      {
        type: "TRANSLATED",
        value: getEnergyResourceTranslationKey(record.energyResource),
      },
      {
        type: "PLAIN",
        value: record.parameter,
      },
      {
        type: "TRANSLATED",
        value: getUnitTranslationKey(record.unit),
      },
      record.normalSettingValue,
      record.upperLimit,
      record.lowerLimit,
      {
        type: "PLAIN",
        value: record.measurementTool,
      },
      record.accuracyCalibrationFrequency,
      {
        type: "PLAIN",
        value: record.valueResponsibleUser.displayName,
      },
      {
        type: "PLAIN",
        value: record.deviationResponsibleUser.displayName,
      },
      {
        type: "PLAIN",
        value: record.note || "-",
      },
    ]),
  };
}
