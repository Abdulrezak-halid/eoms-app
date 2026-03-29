import { IUnit } from "common";
import {
  Activity,
  BatteryFull,
  Box,
  ChartPie,
  Clock,
  Droplet,
  FlaskConical,
  Percent,
  Scale,
  Thermometer,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "../interfaces/IValueLabelMap";

export function useUnitMap() {
  const { t } = useTranslation();

  // Groups are ordered alphabetically by IUnitGroup name.
  // Units inside each group are ordered from smallest to largest
  return useMemo<IValueLabelMap<IUnit>>(
    () => ({
      CURRENT_MA: { icon: Activity, label: t("unitCurrentMa") },
      CURRENT_A: { icon: Activity, label: t("unitCurrentA") },
      FREQUENCY_HZ: { icon: Activity, label: t("unitFrequencyHz") },
      PIECE: { icon: Box, label: t("unitPiece") },
      POWER_W: { icon: BatteryFull, label: t("unitW") },
      POWER_KW: { icon: BatteryFull, label: t("unitKW") },
      POWER_MW: { icon: BatteryFull, label: t("unitMW") },
      ENERGY_WH: { icon: BatteryFull, label: t("unitWh") },
      ENERGY_KWH: { icon: BatteryFull, label: t("unitKWh") },
      ENERGY_MWH: { icon: BatteryFull, label: t("unitMWh") },
      ENERGY_GWH: { icon: BatteryFull, label: t("unitGWh") },
      ENERGY_TWH: { icon: BatteryFull, label: t("unitTWh") },
      PRECIPITATION_MILIMETER_PER_METRE_SQUARE: {
        icon: Droplet,
        label: t("unitMmPerM2"),
      },
      RATE_RATE: { icon: Percent, label: t("unitRate") },
      RATE_PERCENTAGE: { icon: Percent, label: t("unitPercentage") },
      SCALAR: { icon: ChartPie, label: t("unitScalar") },
      TEMPERATURE_CELSIUS: {
        icon: Thermometer,
        label: t("unitCelsius"),
      },
      TIME_SECOND: { icon: Clock, label: t("unitTimeSec") },
      TIME_MINUTE: { icon: Clock, label: t("unitTimeMin") },
      TIME_HOUR: { icon: Clock, label: t("unitTimeHr") },
      VOLTAGE: { icon: Zap, label: t("unitVoltage") },
      VOLUME_LITRE: { icon: FlaskConical, label: t("unitLitre") },
      VOLUME_METRE_CUBE: { icon: Box, label: t("unitCubicMeter") },
      WEIGHT_GRAM: { icon: Scale, label: t("unitWeightGr") },
      WEIGHT_KILOGRAM: { icon: Scale, label: t("unitWeightKg") },
      WEIGHT_TONNE: { icon: Scale, label: t("unitWeightT") },
      APPARENT_POWER_VA: { icon: BatteryFull, label: t("unitVA") },
      APPARENT_POWER_KVA: { icon: BatteryFull, label: t("unitKVA") },
    }),
    [t],
  );
}
