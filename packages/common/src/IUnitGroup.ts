export const DataUnitGroup = [
  "CURRENT", // Amper
  "ENERGY", // Kilo Watt-hour
  "FREQUENCY", // Heltz
  "PIECE", // Piece
  "POWER", // Kilo Watt
  "PRECIPITATION", // mm/m2
  "RATE", // Rate
  "SCALAR", // Scalar
  "TEMPERATURE", // Celsius
  "TIME", // Second
  "VOLTAGE", // Volt
  "VOLUME", // M3
  "WEIGHT", // Kilo Gram
  "APPARENT_POWER", // Kilo Volt-Ampere
] as const;

export type IUnitGroup = (typeof DataUnitGroup)[number];
