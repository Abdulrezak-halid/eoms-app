/**
 * @file: CMultiSelectList.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 30.03.2025
 * Last Modified Date: 30.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Search } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useBuffer } from "../hooks/useBuffer";
import { classNames } from "../utils/classNames";
import { CInputString } from "./CInputString";
import { CNoRecord } from "./CNoRecord";
import { CPopupPanel } from "./CPopupPanel";
import { CSelectListItem, ISelectListItem } from "./CSelectList";

export function CMultiSelectList<TValue>({
  list,
  value,
  onChange,
  disabledValues,
  searchable = false,
  searchPlaceholder,
}: {
  list?: readonly ISelectListItem<TValue>[];
  value?: TValue[];
  onChange?: (value: TValue[]) => void;
  disabledValues?: TValue[];
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const refList = useRef<HTMLDivElement>(null);

  const [bufferedSearch, bufferedSearchPending] = useBuffer(searchQuery);

  const listMapped = useMemo(
    () =>
      list
        ? list.map((d) => ({
            item: {
              ...d,
              disabled: d.disabled || disabledValues?.includes(d.value),
            },
            selected: value?.includes(d.value) || false,
          }))
        : [],
    [list, disabledValues, value],
  );

  const filteredList = useMemo(() => {
    if (!searchable || !bufferedSearch.trim()) {
      return listMapped;
    }

    const query = bufferedSearch.trim().toLowerCase();
    return listMapped.filter((d) => d.item.label.toLowerCase().includes(query));
  }, [listMapped, bufferedSearch, searchable]);

  const handleChange = useCallback(
    (v: TValue, selected: boolean) => {
      if (!onChange) {
        return;
      }
      const set = new Set(value);
      if (selected) {
        set.add(v);
      } else {
        set.delete(v);
      }
      onChange([...set]);
    },
    [value, onChange],
  );

  if (listMapped.length === 0) {
    return (
      // TODO grow is for flex floating ui container
      <CPopupPanel className="p-4 grow">
        <CNoRecord />
      </CPopupPanel>
    );
  }

  return (
    // TODO grow is for flex floating ui container
    <CPopupPanel className="flex flex-col bg-white grow overflow-auto">
      {searchable && (
        <div className="p-1.5">
          <CInputString
            value={searchQuery}
            onChange={setSearchQuery}
            icon={Search}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      <div
        ref={refList}
        className={classNames(
          "p-1 overflow-auto",
          bufferedSearchPending && "opacity-50",
        )}
      >
        {filteredList.length === 0 ? (
          <div className="p-4">
            <CNoRecord />
          </div>
        ) : (
          filteredList.map((d, i) => (
            <CSelectListItem
              key={i}
              item={d.item}
              onChange={handleChange}
              selected={d.selected}
              showCheck
              searchQuery={searchable ? bufferedSearch.trim() : undefined}
              refList={refList}
            />
          ))
        )}
      </div>
    </CPopupPanel>
  );
}
