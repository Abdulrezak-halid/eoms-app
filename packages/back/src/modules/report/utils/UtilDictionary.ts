import { z } from "@hono/zod-openapi";
import { IUnit, IUnitGroup } from "common";

import { IEnergyResource } from "@m/base/interfaces/IEnergyResource";
import { II18n } from "@m/core/interfaces/II18n";
import { IMetricIntegrationPeriod } from "@m/measurement/interfaces/IMetricIntegrationPeriod";

import { SchemaPlainOrTranslatableText } from "../schemas/SchemaTranslatableKeys";

export namespace UtilDictionary {
  export function translateIntegrationPeriod(
    { t }: II18n,
    type: IMetricIntegrationPeriod,
  ): string {
    switch (type) {
      case "DAILY":
        return t("daily");
      case "HOURLY":
        return t("hourly");
      case "MINUTELY":
        return t("minutely");
      case "MONTHLY":
        return t("monthly");
      case "MINUTELY_15":
        return t("minutely");
      case "MINUTELY_5":
        return t("minutely");
      default:
        return "";
    }
  }

  export function translateUnit({ t }: II18n, type: IUnit): string {
    switch (type) {
      case "PIECE":
        return t("unitPiece");
      case "SCALAR":
        return t("unitScalar");
      case "POWER_W":
        return t("unitPowerW");
      case "POWER_KW":
        return t("unitPowerKw");
      case "POWER_MW":
        return t("unitPowerMw");
      case "VOLTAGE":
        return t("unitVoltage");
      case "CURRENT_A":
        return t("unitCurrentA");
      case "CURRENT_MA":
        return t("unitCurrentMa");
      case "ENERGY_KWH":
        return t("unitEnergyKwh");
      case "ENERGY_MWH":
        return t("unitEnergyMwh");
      case "ENERGY_WH":
        return t("unitEnergyWh");
      case "ENERGY_GWH":
        return t("unitEnergyGwh");
      case "ENERGY_TWH":
        return t("unitEnergyTwh");
      case "FREQUENCY_HZ":
        return t("unitFrequencyHz");
      case "PRECIPITATION_MILIMETER_PER_METRE_SQUARE":
        return t("unitPrecipitationMmPerM2");
      case "RATE_PERCENTAGE":
        return t("unitRatePercentage");
      case "RATE_RATE":
        return t("unitRate");
      case "TEMPERATURE_CELSIUS":
        return t("unitTemperatureCelsius");
      case "TIME_HOUR":
        return t("unitTimeHr");
      case "TIME_MINUTE":
        return t("unitTimeMin");
      case "TIME_SECOND":
        return t("unitTimeSec");
      case "VOLUME_LITRE":
        return t("unitVolumeLitre");
      case "VOLUME_METRE_CUBE":
        return t("unitVolumeM3");
      case "WEIGHT_GRAM":
        return t("unitWeightGr");
      case "WEIGHT_KILOGRAM":
        return t("unitWeightKg");
      case "WEIGHT_TONNE":
        return t("unitWeightT");
      case "APPARENT_POWER_VA":
        return t("unitApparentPowerVa");
      case "APPARENT_POWER_KVA":
        return t("unitApparentPowerKva");
      default:
        return type;
    }
  }

  export function translateUnitGroup({ t }: II18n, type: IUnitGroup): string {
    switch (type) {
      case "APPARENT_POWER":
        return t("unitGroupApparentPower");
      case "CURRENT":
        return t("unitGroupCurrent");
      case "ENERGY":
        return t("unitGroupEnergy");
      case "FREQUENCY":
        return t("unitGroupFrequency");
      case "PIECE":
        return t("unitGroupPiece");
      case "POWER":
        return t("unitGroupPower");
      case "PRECIPITATION":
        return t("unitGroupPrecipitation");
      case "RATE":
        return t("unitGroupRate");
      case "SCALAR":
        return t("unitGroupScalar");
      case "TEMPERATURE":
        return t("unitGroupTemperature");
      case "TIME":
        return t("unitGroupTime");
      case "VOLTAGE":
        return t("unitGroupVoltage");
      case "VOLUME":
        return t("unitGroupVolume");
      case "WEIGHT":
        return t("unitGroupWeight");
      default:
        return "";
    }
  }

  export function translateEnergyResource(
    { t }: II18n,
    type: IEnergyResource,
  ): string {
    switch (type) {
      case "GAS":
        return t("gas");
      case "WATER":
        return t("water");
      case "DIESEL":
        return t("diesel");
      case "ELECTRIC":
        return t("electric");
      case "SOLID_FUEL":
        return t("solidFuel");
    }
  }

  export function translateValue(
    { t }: II18n,
    translatableText: z.infer<typeof SchemaPlainOrTranslatableText>,
  ) {
    if (translatableText.type === "TRANSLATED") {
      return t(translatableText.value);
    }
    return translatableText.value;
  }
}
