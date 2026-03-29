import { IUnitGroup } from "common";
import { IDtoETranslationKeys } from "common/build-api-schema";

export function getUnitGroupTranslationKey(
  unitGroup: IUnitGroup,
): IDtoETranslationKeys {
  switch (unitGroup) {
    case "APPARENT_POWER":
      return "unitGroupApparentPower";
    case "CURRENT":
      return "unitGroupCurrent";
    case "ENERGY":
      return "unitGroupEnergy";
    case "FREQUENCY":
      return "unitGroupFrequency";
    case "PIECE":
      return "unitGroupPiece";
    case "POWER":
      return "unitGroupPower";
    case "PRECIPITATION":
      return "unitGroupPrecipitation";
    case "RATE":
      return "unitGroupRate";
    case "SCALAR":
      return "unitGroupScalar";
    case "TEMPERATURE":
      return "unitGroupTemperature";
    case "TIME":
      return "unitGroupTime";
    case "VOLTAGE":
      return "unitGroupVoltage";
    case "VOLUME":
      return "unitGroupVolume";
    case "WEIGHT":
      return "unitGroupWeight";
  }
}
