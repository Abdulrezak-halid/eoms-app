import { IUnit, UtilUnit } from "common";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useUnitAbbreviation(unit: IUnit) {
  const { t } = useTranslation();
  return UtilUnit.getAbbreviation(unit, t);
}
