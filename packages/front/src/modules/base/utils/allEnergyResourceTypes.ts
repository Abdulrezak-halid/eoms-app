/**
 * @file: allEnergyResourceTypes.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.07.2025
 * Last Modified Date: 11.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IDtoEEnergyResource } from "common/build-api-schema";

export const allEnergyResourceTypes = Object.keys({
  ELECTRIC: true,
  GAS: true,
  WATER: true,
  DIESEL: true,
  SOLID_FUEL: true,
} satisfies Record<IDtoEEnergyResource, true>) as IDtoEEnergyResource[];
