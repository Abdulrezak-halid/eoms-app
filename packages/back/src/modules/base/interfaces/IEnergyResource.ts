export const DataEnergyResource = [
  "ELECTRIC",
  "GAS",
  "DIESEL",
  "WATER",
  "SOLID_FUEL",
] as const;
export type IEnergyResource = (typeof DataEnergyResource)[number];
