import { IUnit } from "./IUnit";
import { IUnitGroup } from "./IUnitGroup";

const multipliers: Partial<Record<IUnit, number>> = {
  APPARENT_POWER_VA: 0.001,
  CURRENT_MA: 0.001,
  ENERGY_MWH: 1_000,
  ENERGY_WH: 0.001,
  POWER_MW: 1_000,
  POWER_W: 0.001,
  RATE_PERCENTAGE: 0.01,
  TIME_HOUR: 3600,
  TIME_MINUTE: 60,
  VOLUME_LITRE: 0.001,
  WEIGHT_GRAM: 0.001,
  WEIGHT_TONNE: 1_000,
};

const unitGroupMap: Record<IUnit, IUnitGroup> = {
  APPARENT_POWER_KVA: "APPARENT_POWER",
  APPARENT_POWER_VA: "APPARENT_POWER",
  CURRENT_A: "CURRENT",
  CURRENT_MA: "CURRENT",
  ENERGY_GWH: "ENERGY",
  ENERGY_KWH: "ENERGY",
  ENERGY_MWH: "ENERGY",
  ENERGY_TWH: "ENERGY",
  ENERGY_WH: "ENERGY",
  FREQUENCY_HZ: "FREQUENCY",
  PIECE: "PIECE",
  POWER_KW: "POWER",
  POWER_MW: "POWER",
  POWER_W: "POWER",
  PRECIPITATION_MILIMETER_PER_METRE_SQUARE: "PRECIPITATION",
  RATE_PERCENTAGE: "RATE",
  RATE_RATE: "RATE",
  SCALAR: "SCALAR",
  TEMPERATURE_CELSIUS: "TEMPERATURE",
  TIME_HOUR: "TIME",
  TIME_MINUTE: "TIME",
  TIME_SECOND: "TIME",
  VOLTAGE: "VOLTAGE",
  VOLUME_LITRE: "VOLUME",
  VOLUME_METRE_CUBE: "VOLUME",
  WEIGHT_GRAM: "WEIGHT",
  WEIGHT_KILOGRAM: "WEIGHT",
  WEIGHT_TONNE: "WEIGHT",
};

const baseUnitMap: Record<IUnitGroup, IUnit> = {
  APPARENT_POWER: "APPARENT_POWER_KVA",
  CURRENT: "CURRENT_A",
  ENERGY: "ENERGY_KWH",
  FREQUENCY: "FREQUENCY_HZ",
  PIECE: "PIECE",
  POWER: "POWER_KW",
  PRECIPITATION: "PRECIPITATION_MILIMETER_PER_METRE_SQUARE",
  RATE: "RATE_RATE",
  SCALAR: "SCALAR",
  TEMPERATURE: "TEMPERATURE_CELSIUS",
  TIME: "TIME_SECOND",
  VOLTAGE: "VOLTAGE",
  VOLUME: "VOLUME_METRE_CUBE",
  WEIGHT: "WEIGHT_KILOGRAM",
};

// This map defines if default unit is different than base unit
const defaultUnitMap: Partial<Record<IUnitGroup, IUnit>> = {
  TIME: "TIME_HOUR",
};

export namespace UtilUnit {
  export function getBaseMultiplier(unit: IUnit): number {
    return multipliers[unit] || 1;
  }

  export function getGroup(unit: IUnit): IUnitGroup {
    return unitGroupMap[unit];
  }

  // export function getBase(group: IUnitGroup): IUnit {
  //   return baseUnitMap[group];
  // }

  export function getDefault(group: IUnitGroup): IUnit {
    return defaultUnitMap[group] || baseUnitMap[group];
  }

  export function getUnitsByGroup(group: IUnitGroup): IUnit[] {
    return Object.entries(unitGroupMap)
      .filter(([, unitGroup]) => unitGroup === group)
      .map(([unit]) => unit as IUnit);
  }

  export function getAbbreviation(
    unit: IUnit,
    t: (
      key:
        | "unitPieceShort"
        | "timeHourShort"
        | "timeMinuteShort"
        | "timeSecondShort",
    ) => string,
  ): string {
    switch (unit) {
      case "CURRENT_A":
        return "A";
      case "CURRENT_MA":
        return "mA";
      case "FREQUENCY_HZ":
        return "Hz";
      case "PIECE":
        return t("unitPieceShort");
      case "POWER_KW":
        return "kW";
      case "POWER_MW":
        return "MW";
      case "POWER_W":
        return "W";
      case "ENERGY_GWH":
        return "GWh";
      case "ENERGY_KWH":
        return "kWh";
      case "ENERGY_MWH":
        return "MWh";
      case "ENERGY_TWH":
        return "TWh";
      case "ENERGY_WH":
        return "Wh";
      case "PRECIPITATION_MILIMETER_PER_METRE_SQUARE":
        return "mm/m²";
      case "RATE_PERCENTAGE":
        return "%";
      case "RATE_RATE":
        return "×";
      case "SCALAR":
        return "×";
      case "TEMPERATURE_CELSIUS":
        return "°C";
      case "TIME_HOUR":
        return t("timeHourShort");
      case "TIME_MINUTE":
        return t("timeMinuteShort");
      case "TIME_SECOND":
        return t("timeSecondShort");
      case "VOLTAGE":
        return "V";
      case "VOLUME_LITRE":
        return "L";
      case "VOLUME_METRE_CUBE":
        return "m³";
      case "WEIGHT_GRAM":
        return "g";
      case "WEIGHT_KILOGRAM":
        return "kg";
      case "WEIGHT_TONNE":
        return "t";
      case "APPARENT_POWER_VA":
        return "VA";
      case "APPARENT_POWER_KVA":
        return "kVA";
    }
  }

  export function getCounterUnitGroups(): IUnitGroup[] {
    return ["ENERGY", "PIECE", "SCALAR", "TIME", "VOLUME", "WEIGHT"];
  }
}
