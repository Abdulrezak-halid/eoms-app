import { useCallback, useRef, useState } from "react";

import { classNames } from "@m/core/utils/classNames";

import { CIcon, IconType } from "./CIcon";

export function CSwitch<TValue>({
  selected,
  onChange,
  value,
  onClick,
  label,
  disabled,
  iconOff,
  iconOn,
  hideLabelMd,
  hideLabelLg,
}: {
  selected?: boolean;
  onChange?: (selected: boolean) => Promise<void> | void;
  value?: TValue;
  onClick?: (value: TValue, selected: boolean) => Promise<void> | void;
  label?: string;
  disabled?: boolean;
  iconOff?: IconType;
  iconOn?: IconType;
  hideLabelMd?: boolean;
  hideLabelLg?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(async () => {
    // Promises logic is used not to lose focus if callbacks are not async.
    let promises = [];
    promises.push(onChange?.(!selected));
    if (onClick && value !== undefined) {
      promises.push(onClick(value, !selected));
    }
    promises = promises.filter((d) => d instanceof Promise);

    if (promises.length) {
      setBusy(true);
      await Promise.all(promises);
      setBusy(false);
    }
  }, [onChange, selected, onClick, value]);

  return (
    <button
      ref={ref}
      type="button"
      className="group outline-hidden flex items-center space-x-2"
      onClick={handleClick}
      disabled={disabled || busy}
    >
      <div
        className={classNames(
          // my * 2 + h = 12 (button height)
          "my-2 rounded-full transition-[background,opacity] flex-none shadow-sm",
          "group-disabled:opacity-40",
          "group-focus:x-outline",
          // bg is same as CInputContainer
          selected
            ? "bg-accent-600 dark:bg-accent-300"
            : "bg-white dark:bg-gray-700",
        )}
      >
        <div className="h-8 w-14 overflow-hidden">
          <div
            className={classNames(
              "w-6 h-6 m-1 rounded-full transition-[margin,background] flex justify-center items-center",
              selected && "ml-7",
              selected
                ? "bg-gray-100 text-accent-600 dark:bg-gray-800 dark:text-accent-300"
                : "bg-accent-600 text-accent-50 dark:bg-accent-400 dark:text-accent-950",
            )}
          >
            {!selected && iconOff && <CIcon value={iconOff} sm />}
            {selected && iconOn && <CIcon value={iconOn} sm />}
          </div>
        </div>
      </div>

      {label && (
        <div
          className={classNames(
            "group-disabled:opacity-40 text-left pr-2 py-3 leading-5 font-bold text-accent-700 dark:text-accent-200",
            hideLabelMd && "hidden @md:block",
            hideLabelLg && "hidden @lg:block",
          )}
        >
          {label}
        </div>
      )}
    </button>
  );
}
