import {
  IDtoEEnergyResource,
  IDtoETranslationKeys,
} from "common/build-api-schema";

export function getEnergyResourceCostTranslationKey(
  energyResource: IDtoEEnergyResource,
): IDtoETranslationKeys {
  switch (energyResource) {
    case "ELECTRIC": {
      return "electricCost";
    }
    case "GAS": {
      return "gasCost";
    }
    case "DIESEL": {
      return "dieselCost";
    }
    case "WATER": {
      return "waterCost";
    }
    case "SOLID_FUEL": {
      return "solidFuelCost";
    }
  }
}
