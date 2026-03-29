import { IUnit, IUnitGroup, UtilUnit } from "common";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useUnitMap } from "../hooks/useUnitMap";

export interface ICComboboxUnitProps
  extends Omit<ICComboboxProps<IUnit>, "list"> {
  unitGroup?: IUnitGroup;
}

export function CComboboxUnit({ unitGroup, ...props }: ICComboboxUnitProps) {
  const { t } = useTranslation();

  const map = useUnitMap();
  const list = useMapToComboList(map);

  const listFiltered = useMemo(() => {
    if (!unitGroup) {
      return list;
    }
    const allowedUnits = new Set(UtilUnit.getUnitsByGroup(unitGroup));
    return list.filter((item) => allowedUnits.has(item.value));
  }, [unitGroup, list]);

  return (
    <CCombobox placeholder={t("selectAUnit")} {...props} list={listFiltered} />
  );
}
