/**
 * @file: CInputChipItem.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 30.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { X } from "lucide-react";
import { MouseEvent, ReactNode, useCallback } from "react";

import { classNames } from "@m/core/utils/classNames";

import { CIcon, CIconOrCustom, IconType } from "./CIcon";

export function CInputChipItem<TValue>({
  icon,
  value,
  label,
  onRemove,
}: {
  icon?: IconType | ReactNode;
  value: TValue;
  label: string;
  onRemove?: (value: TValue) => void;
}) {
  const handleClose = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onRemove?.(value);
    },
    [onRemove, value],
  );

  return (
    <div
      className={classNames(
        "bg-gray-200 text-black dark:bg-gray-800 dark:text-gray-200 rounded-sm flex items-center min-w-0 text-sm px-1.5 space-x-1.5",
        onRemove && "pr-0",
      )}
    >
      {icon && <CIconOrCustom value={icon} sm className="flex-none mr-1.5" />}
      <div className="py-1 truncate">{label}</div>
      {onRemove && (
        // TODO button
        <div
          // type="button"
          onClick={handleClose}
          className="focus:rounded-md p-2 hover:cursor-pointer hover:group-disabled:cursor-default"
        >
          <CIcon
            value={X}
            className="text-accent-700 dark:text-accent-200"
            sm
          />
        </div>
      )}
    </div>
  );
}
