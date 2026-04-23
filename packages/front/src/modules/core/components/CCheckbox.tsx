/**
 * @file: CCheckbox2.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 22.10.2024
 * Last Modified Date: 27.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { Check, Minus } from "lucide-react";
import { useCallback } from "react";

import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";
import { CInputContainer } from "./CInputContainer";

export function CCheckbox<TValue>({
  selected,
  semiSelected,
  value,
  onClick,
  onChange,
  icon,
  label,
  truncateLabel,
  disabled,
  radio,
  invalid,
}: {
  selected?: boolean;
  semiSelected?: boolean;
  value?: TValue;
  onClick?: (value: TValue, selected: boolean) => void;
  onChange?: (selected: boolean) => void;
  icon?: IconType;
  label?: string;
  truncateLabel?: boolean;
  disabled?: boolean;
  radio?: boolean;
  invalid?: boolean;
}) {
  const handleClick = useCallback(() => {
    if (onClick && value !== undefined) {
      onClick(value, !selected);
    }
    onChange?.(!selected);
  }, [onClick, onChange, value, selected]);

  return (
    <button
      type="button"
      className="group outline-hidden flex items-center space-x-2 py-1 min-w-0"
      onClick={handleClick}
      disabled={disabled}
    >
      {radio ? (
        <CInputContainer
          className="w-10 h-10 flex justify-center items-center rounded-full! flex-none"
          invalid={invalid}
        >
          {selected && (
            <div
              className={classNames(
                "w-5 h-5 rounded-full",
                invalid
                  ? "bg-rose-500 dark:bg-rose-200"
                  : "bg-accent-600 dark:bg-accent-300",
              )}
            />
          )}
        </CInputContainer>
      ) : (
        <CInputContainer
          className="w-10 h-10 flex justify-center items-center flex-none"
          invalid={invalid}
        >
          {(semiSelected || selected) && (
            <CIcon
              value={semiSelected ? Minus : Check}
              className={classNames(
                invalid
                  ? "text-rose-600 dark:text-rose-200"
                  : "text-accent-600 dark:text-accent-300",
              )}
              lg
            />
          )}
        </CInputContainer>
      )}

      {icon && <CIcon className="group-disabled:opacity-40" value={icon} />}

      {label && (
        <div
          className={classNames(
            "group-disabled:opacity-40 text-left leading-5 font-bold",
            invalid
              ? "text-rose-500 dark:text-rose-300"
              : "text-accent-700 dark:text-accent-200",
            truncateLabel && "truncate",
          )}
          title={truncateLabel ? label : undefined}
        >
          {label}
        </div>
      )}
    </button>
  );
}
