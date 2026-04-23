/**
 * @file: useUnitAbbreviation.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.08.2025
 * Last Modified Date: 30.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IUnit, UtilUnit } from "common";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useUnitAbbreviation(unit: IUnit) {
  const { t } = useTranslation();
  return UtilUnit.getAbbreviation(unit, t);
}
