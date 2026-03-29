/**
 * @file: getEnergyResourceTranslationKey.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 21.01.2026
 * Last Modified Date: 21.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
