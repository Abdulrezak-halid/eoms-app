import { IDtoEEnergyResource } from "common/build-api-schema";

export const allEnergyResourceTypes = Object.keys({
  ELECTRIC: true,
  GAS: true,
  WATER: true,
  DIESEL: true,
  SOLID_FUEL: true,
} satisfies Record<IDtoEEnergyResource, true>) as IDtoEEnergyResource[];
