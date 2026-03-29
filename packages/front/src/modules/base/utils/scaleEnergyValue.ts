import { IUnit } from "common";

export type IScaledEnergyValue = {
  value: number;
  unit: IUnit;
};

/**
 * Tiers are ordered descending by threshold so the first match wins.
 * The final entry (threshold: 0) acts as the kWh fallback for any finite value,
 * including zero and values below 1 000.
 */
const ENERGY_TIERS: {
  threshold: number;
  divisor: number;
  unit: IUnit;
}[] = [
  { threshold: 1_000_000_000, divisor: 1_000_000_000, unit: "ENERGY_TWH" },
  { threshold: 1_000_000, divisor: 1_000_000, unit: "ENERGY_GWH" },
  { threshold: 1_000, divisor: 1_000, unit: "ENERGY_MWH" },
  { threshold: 0, divisor: 1, unit: "ENERGY_KWH" },
];

/**
 * Scales a raw energy value (in kWh) to the most appropriate display unit.
 *
 * Tier selection is based on the absolute value so that negative numbers
 * scale to the same unit as their positive counterpart.
 *
 * @param value Energy amount in kWh
 * @returns Scaled numeric value and the corresponding domain IUnit
 */
export function scaleEnergyValue(value: number): IScaledEnergyValue {
  const abs = Math.abs(value);
  const tier =
    ENERGY_TIERS.find(({ threshold }) => abs >= threshold) ??
    ENERGY_TIERS[ENERGY_TIERS.length - 1];

  return { value: value / tier.divisor, unit: tier.unit };
}
