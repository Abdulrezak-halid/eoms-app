import { IDtoEEnergyResource } from "common/build-api-schema";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import {
  Flame,
  Droplet,
  Fuel,
  Zap,
} from "lucide-react";

import { IValueLabelMap } from "../interfaces/IValueLabelMap";

export function useEnergyResourceMap() {
  const { t } = useTranslation();
  return useMemo<IValueLabelMap<IDtoEEnergyResource>>(
    () => ({
      ELECTRIC: {
        icon: Zap,
        label: t("electric"),
      },
      GAS: {
        icon: Flame,
        label: t("gas"),
      },
      DIESEL: {
        icon: Fuel,
        label: t("diesel"),
      },
      WATER: {
        icon: Droplet,
        label: t("water"),
      },
      SOLID_FUEL: {
        icon: Flame,
        label: t("solidFuel"),
      },
    }),
    [t],
  );
}
