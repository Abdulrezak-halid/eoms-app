import { IUnitGroup } from "common";
import { useMemo } from "react";
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

import { useTranslation } from "@m/core/hooks/useTranslation";

import { IValueLabelMap } from "../interfaces/IValueLabelMap";

export function useUnitGroupMap() {
  const { t } = useTranslation();

  return useMemo<IValueLabelMap<IUnitGroup>>(
    () => ({
      CURRENT: { icon: Activity, label: t("unitGroupCurrent") },
      ENERGY: { icon: BatteryFull, label: t("unitGroupEnergy") },
      FREQUENCY: { icon: Activity, label: t("unitGroupFrequency") },
      PIECE: { icon: Box, label: t("unitGroupPiece") },
      POWER: { icon: BatteryFull, label: t("unitGroupPower") },
      PRECIPITATION: {
        icon: Droplet,
        label: t("unitGroupPrecipitation"),
      },
      RATE: { icon: Percent, label: t("unitGroupRate") },
      SCALAR: { icon: ChartPie, label: t("unitGroupScalar") },
      TEMPERATURE: {
        icon: Thermometer,
        label: t("unitGroupTemperature"),
      },
      TIME: { icon: Clock, label: t("unitGroupTime") },
      VOLTAGE: { icon: Zap, label: t("unitGroupVoltage") },
      VOLUME: { icon: FlaskConical, label: t("unitGroupVolume") },
      WEIGHT: { icon: Scale, label: t("unitGroupWeight") },
      APPARENT_POWER: {
        icon: BatteryFull,
        label: t("unitGroupApparentPower"),
      },
    }),
    [t],
  );
}
