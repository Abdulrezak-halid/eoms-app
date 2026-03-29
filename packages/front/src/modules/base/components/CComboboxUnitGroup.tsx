import { IUnitGroup } from "common";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CCombobox, ICComboboxProps } from "@m/core/components/CCombobox";
import { useMapToComboList } from "@m/core/hooks/useMapToComboList";

import { useUnitGroupMap } from "../hooks/useUnitGroupMap";

export function CComboboxUnitGroup(
  props: Omit<ICComboboxProps<IUnitGroup>, "list"> & {
    unitGroups?: IUnitGroup[];
  },
) {
  const { t } = useTranslation();
  const map = useUnitGroupMap();
  const list = useMapToComboList(map);

  const { unitGroups } = props;
  const listFiltered = useMemo(() => {
    return unitGroups
      ? list.filter((item) => unitGroups.includes(item.value))
      : list;
  }, [list, unitGroups]);

  return (
    <CCombobox
      placeholder={t("selectAUnitGroup")}
      {...props}
      list={listFiltered}
    />
  );
}
