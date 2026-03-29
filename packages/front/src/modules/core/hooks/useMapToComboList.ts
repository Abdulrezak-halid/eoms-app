import { useMemo } from "react";

import { IconType } from "../components/CIcon";
import { ISelectListItem } from "../components/CSelectList";

export function useMapToComboList<T extends string>(
  map: Partial<
    Record<T, { icon?: IconType; imageSrc?: string; label: string }>
  >,
) {
  return useMemo(() => {
    const list: ISelectListItem<T>[] = [];
    for (const key in map) {
      const item = map[key as T];
      if (!item) {
        continue;
      }
      list.push({
        icon: item.icon,
        imageSrc: item.imageSrc,
        label: item.label,
        value: key as T,
      });
    }
    return list;
  }, [map]);
}
