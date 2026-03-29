/**
 * @file: useUnitMultiplierAndAbbr.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 02.10.2025
 * Last Modified Date: 02.10.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
