import { describe, expect, it } from "vitest";

import { scaleEnergyValue } from "../utils/scaleEnergyValue";

describe("scaleEnergyValue", () => {
  // --- kWh tier ---
  it("returns ENERGY_KWH for 0", () => {
    expect(scaleEnergyValue(0)).toStrictEqual({
      value: 0,
      unit: "ENERGY_KWH",
    });
  });

  it("returns ENERGY_KWH for values below 1 000", () => {
    expect(scaleEnergyValue(100)).toStrictEqual({
      value: 100,
      unit: "ENERGY_KWH",
    });
    expect(scaleEnergyValue(999)).toStrictEqual({
      value: 999,
      unit: "ENERGY_KWH",
    });
  });

  // --- MWh tier ---
  it("returns ENERGY_MWH at exactly 1 000", () => {
    expect(scaleEnergyValue(1_000)).toStrictEqual({
      value: 1,
      unit: "ENERGY_MWH",
    });
  });

  it("returns ENERGY_MWH for values in [1 000, 1 000 000)", () => {
    expect(scaleEnergyValue(10_000)).toStrictEqual({
      value: 10,
      unit: "ENERGY_MWH",
    });
    expect(scaleEnergyValue(999_999)).toStrictEqual({
      value: 999.999,
      unit: "ENERGY_MWH",
    });
  });

  // --- GWh tier ---
  it("returns ENERGY_GWH at exactly 1 000 000", () => {
    expect(scaleEnergyValue(1_000_000)).toStrictEqual({
      value: 1,
      unit: "ENERGY_GWH",
    });
  });

  it("returns ENERGY_GWH for values in [1 000 000, 1 000 000 000)", () => {
    expect(scaleEnergyValue(10_000_000)).toStrictEqual({
      value: 10,
      unit: "ENERGY_GWH",
    });
  });

  // --- TWh tier ---
  it("returns ENERGY_TWH at exactly 1 000 000 000", () => {
    expect(scaleEnergyValue(1_000_000_000)).toStrictEqual({
      value: 1,
      unit: "ENERGY_TWH",
    });
  });

  it("returns ENERGY_TWH for very large values", () => {
    expect(scaleEnergyValue(2_000_000_000)).toStrictEqual({
      value: 2,
      unit: "ENERGY_TWH",
    });
  });

  // --- Negative values ---
  it("scales negative values using their absolute magnitude", () => {
    expect(scaleEnergyValue(-5_000)).toStrictEqual({
      value: -5,
      unit: "ENERGY_MWH",
    });
    expect(scaleEnergyValue(-100)).toStrictEqual({
      value: -100,
      unit: "ENERGY_KWH",
    });
    expect(scaleEnergyValue(-10_000_000)).toStrictEqual({
      value: -10,
      unit: "ENERGY_GWH",
    });
  });
});
