import { PropsWithChildren, ReactNode } from "react";

import { classNames } from "@m/core/utils/classNames";

import { CIconOrCustom, IconType } from "./CIcon";

export function CInputContainer({
  children,
  className,
  disabled,
  invalid,
  icon,
  noFocusWithin,
}: PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  icon?: IconType | ReactNode;
  noFocusWithin?: boolean;
}>) {
  return (
    <div
      className={classNames(
        "bg-white dark:bg-gray-700 relative rounded-md group-disabled:opacity-40 shadow-sm",
        // To clip autofill bg
        "overflow-hidden",
        !noFocusWithin && "focus-within:x-outline",
        "group-focus:x-outline",
        disabled && "opacity-40",
        invalid && !disabled && "bg-rose-50! dark:bg-rose-400/25!",
        className,
      )}
    >
      {icon && (
        <div className="absolute top-0 bottom-0 left-0 pl-3 pointer-events-none flex items-center">
          <CIconOrCustom value={icon} />
        </div>
      )}
      {children}
    </div>
  );
}
