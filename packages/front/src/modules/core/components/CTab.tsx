import { ReactElement, useCallback, useMemo } from "react";

import { useRoutePath } from "@m/core/hooks/useRoutePath";

import { classNames } from "../utils/classNames";
import { useNavigate } from "../hooks/useNavigate";
import { IRoutePath } from "../interfaces/IRoutePath";

export interface ITabListPathItem {
  label: string;
  component?: ReactElement;

  path: IRoutePath;
  value?: undefined;
}
export interface ITabListValueItem<TValue = string> {
  label: string;
  component?: ReactElement;

  path?: undefined;
  value: TValue;
}

export type ITabListItem<TValue = string> =
  | ITabListPathItem
  | ITabListValueItem<TValue>;

export function CTab<TValue>({
  list,
  value,
  onChange,
}: {
  list: ITabListItem<TValue>[];
  value?: TValue;
  onChange?: (value: TValue) => void;
}) {
  const loc = useRoutePath();
  const activeItem = useMemo(() => {
    return list.find(
      (d) => d.path === loc || (value !== undefined && d.value === value),
    );
  }, [list, loc, value]);

  return (
    // space-x-2 is just for outline
    <div className="space-y-4">
      <div className="flex items-end space-x-2 overflow-x-auto">
        {list.map((d) => (
          <CTabLink
            key={d.label}
            item={d}
            active={activeItem === d}
            onChange={onChange}
          />
        ))}
      </div>
      {activeItem?.component}
    </div>
  );
}

function CTabLink<TValue>({
  item,
  active,
  onChange,
}: {
  item: ITabListItem<TValue>;
  active: boolean;
  onChange?: (value: TValue) => void;
}) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    if (onChange && item.value !== undefined) {
      onChange(item.value);
    }
  }, [item.path, item.value, navigate, onChange]);

  return (
    <button
      type="button"
      className={classNames(
        "font-bold pt-3 pb-2 px-2 border-b-4 outline-hidden text-nowrap",
        active
          ? "pointer-events-none border-gray-700 dark:border-accent-300 rounded-b-sm"
          : "focus:x-outline focus:-outline-offset-2! rounded-md border-transparent text-accent-700 dark:text-accent-200",
      )}
      tabIndex={active ? -1 : undefined}
      onClick={handleClick}
    >
      {item.label}
    </button>
  );
}
