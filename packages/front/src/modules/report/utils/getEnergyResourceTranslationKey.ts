import {
  IDtoEEnergyResource,
  IDtoETranslationKeys,
} from "common/build-api-schema";

export function getEnergyResourceTranslationKey(
  energyResource: IDtoEEnergyResource,
): IDtoETranslationKeys {
  switch (energyResource) {
    case "ELECTRIC": {
      return "electric";
    }
    case "GAS": {
      return "gas";
    }
    case "DIESEL": {
      return "diesel";
    }
    case "WATER": {
      return "water";
    }
    case "SOLID_FUEL": {
      return "solidFuel";
    }
  }
}
