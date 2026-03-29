import { IDtoETranslationKeys } from "common/build-api-schema";
import { IUnit } from "common/src/IUnit";

export function getUnitTranslationKey(unit: IUnit): IDtoETranslationKeys {
  switch (unit) {
    case "CURRENT_A":
      return "unitCurrentA";
    case "CURRENT_MA":
      return "unitCurrentMa";

    case "ENERGY_KWH":
      return "unitEnergyKwh";
    case "ENERGY_MWH":
      return "unitEnergyMwh";
    case "ENERGY_WH":
      return "unitEnergyWh";
    case "ENERGY_GWH":
      return "unitEnergyGwh";
    case "ENERGY_TWH":
      return "unitEnergyTwh";

    case "FREQUENCY_HZ":
      return "unitFrequencyHz";

    case "PIECE":
      return "unitPiece";

    case "POWER_KW":
      return "unitPowerKw";
    case "POWER_MW":
      return "unitPowerMw";
    case "POWER_W":
      return "unitPowerW";

    case "PRECIPITATION_MILIMETER_PER_METRE_SQUARE":
      return "unitPrecipitationMmPerM2";

    case "RATE_PERCENTAGE":
      return "unitRatePercentage";
    case "RATE_RATE":
      return "unitRate";

    case "SCALAR":
      return "unitScalar";

    case "TEMPERATURE_CELSIUS":
      return "unitTemperatureCelsius";

    case "TIME_HOUR":
      return "unitTimeHr";
    case "TIME_MINUTE":
      return "unitTimeMin";
    case "TIME_SECOND":
      return "unitTimeSec";

    case "VOLTAGE":
      return "unitVoltage";

    case "VOLUME_LITRE":
      return "unitVolumeLitre";
    case "VOLUME_METRE_CUBE":
      return "unitVolumeM3";

    case "WEIGHT_GRAM":
      return "unitWeightGr";
    case "WEIGHT_KILOGRAM":
      return "unitWeightKg";
    case "WEIGHT_TONNE":
      return "unitWeightT";

    case "APPARENT_POWER_VA":
      return "unitApparentPowerVa";
    case "APPARENT_POWER_KVA":
      return "unitApparentPowerKva";
  }
}
