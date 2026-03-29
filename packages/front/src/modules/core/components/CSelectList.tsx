/**
 * @file: CSelectList.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 18.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Check, Search } from "lucide-react";
import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "wouter";

import { useBuffer } from "@m/core/hooks/useBuffer";
import { classNames } from "@m/core/utils/classNames";

import { IRoutePath } from "../interfaces/IRoutePath";
import { CHighlightedMatchText } from "./CHighlightedMatchText";
import { CIcon, CIconOrCustom, IconType } from "./CIcon";
import { CInputString } from "./CInputString";
import { CNoRecord } from "./CNoRecord";
import { CPopupPanel } from "./CPopupPanel";

export interface ISelectListItem<TValue> {
  icon?: IconType | ReactNode;
  // Currently only used by CSelectorBigButton
  imageSrc?: string;
  label: string;
  disabled?: boolean;
  value: TValue;

  // Path is a special property, when set, option will work like link
  path?: IRoutePath;
}

export function CSelectList<TValue>({
  list,
  value,
  onChange,
  disabledValues,
  enabledValues,
  searchable = false,
  searchPlaceholder,
  className,
  inline,
}: {
  list?: readonly ISelectListItem<TValue>[];
  value?: TValue;
  onChange?: (value: TValue) => void;
  disabledValues?: TValue[];
  enabledValues?: TValue[];
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  inline?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const refList = useRef<HTMLDivElement>(null);

  const [bufferedSearch, bufferedSearchPending] = useBuffer(searchQuery);

  const listMapped = useMemo(
    () =>
      list
        ? list.map((d) => ({
            ...d,
            disabled:
              d.disabled ||
              disabledValues?.includes(d.value) ||
              (enabledValues && !enabledValues.includes(d.value)),
          }))
        : [],
    [list, disabledValues, enabledValues],
  );

  const filteredList = useMemo(() => {
    if (!searchable || !bufferedSearch.trim()) {
      return listMapped;
    }

    const query = bufferedSearch.trim().toLowerCase();
    return listMapped.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
  }, [listMapped, bufferedSearch, searchable]);

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
    <CPopupPanel
      className={classNames(
        "flex flex-col bg-white grow overflow-auto",
        className,
      )}
      inline={inline}
    >
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
              item={d}
              onChange={onChange}
              selected={value === d.value}
              searchQuery={searchable ? bufferedSearch.trim() : undefined}
              refList={refList}
            />
          ))
        )}
      </div>
    </CPopupPanel>
  );
}

export function CSelectListItem<TValue>({
  item,
  onChange,
  selected,
  showCheck,
  searchQuery,
  refList,
}: {
  item: ISelectListItem<TValue>;
  onChange?: (value: TValue, selected: boolean) => void;
  selected: boolean;
  showCheck?: boolean;
  searchQuery?: string;
  refList: RefObject<HTMLDivElement | null>;
}) {
  const handleChange = useCallback(() => {
    onChange?.(item.value, !selected);
  }, [selected, onChange, item.value]);

  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    if (selected && refList.current && ref.current) {
      const frameId = requestAnimationFrame(() => {
        if (refList.current && ref.current) {
          refList.current.scrollTop =
            ref.current.offsetTop - refList.current.offsetTop;
        }
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [refList, selected]);

  const child = (
    <div
      className={classNames(
        "m-0.5 p-2.5 rounded-md group-focus/item:x-outline flex items-center space-x-2 min-w-0",
        selected
          ? "bg-accent-600 dark:bg-accent-600 text-white group-hover/item:bg-accent-700 dark:group-hover/item:bg-accent-500"
          : "text-accent-700 dark:text-accent-200 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700",
      )}
    >
      {showCheck && (
        <div className="w-6">{selected && <CIcon value={Check} />}</div>
      )}
      {item.icon && <CIconOrCustom value={item.icon} />}
      <div className="text-nowrap font-bold truncate">
        <CHighlightedMatchText value={item.label} query={searchQuery} />
      </div>
    </div>
  );

  if (item.path) {
    return (
      <Link
        ref={ref as RefObject<HTMLAnchorElement | null>}
        to={item.path}
        // pointer-events-none is to disable hover effects
        className={classNames(
          "outline-hidden text-left w-full disabled:opacity-40 group/item disabled:pointer-events-none min-w-0",
          // Undisabling selected items is convenient when using with
          //   disabledValues - collecting selected values in an array to disable
          //   other comboboxes
          !selected && item.disabled && "opacity-40 pointer-events-none",
        )}
      >
        {child}
      </Link>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement | null>}
      type="button"
      // pointer-events-none is to disable hover effects
      className="outline-hidden text-left w-full disabled:opacity-40 group/item disabled:pointer-events-none min-w-0"
      onClick={handleChange}
      // Undisabling selected items is convenient when using with
      //   disabledValues - collecting selected values in an array to disable
      //   other comboboxes
      disabled={!selected && item.disabled}
    >
      {child}
    </button>
  );
}
