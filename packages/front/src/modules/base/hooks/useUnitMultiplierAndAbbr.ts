import { IUnitGroup, UtilUnit } from "common";
import { useMemo } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";

export function useUnitInfo(unitGroup: IUnitGroup) {
  const { t } = useTranslation();

  const defaultUnit = UtilUnit.getDefault(unitGroup);

  return useMemo(
    () => ({
      unit: defaultUnit,
      abbr: UtilUnit.getAbbreviation(defaultUnit, t),
      multiplier: 1 / UtilUnit.getBaseMultiplier(defaultUnit),
    }),
    [defaultUnit, t],
  );
}
