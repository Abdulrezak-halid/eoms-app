import { ReactNode } from "react";

import { CIcon, IconType } from "@m/core/components/CIcon";
import { classNames } from "@m/core/utils/classNames";

export function CBadgeContainer({
  icon,
  children,
  className,
  noTruncate,
  wrap,
  inline,
}: {
  icon?: IconType;
  children: ReactNode;
  className?: string;
  noTruncate?: boolean;
  wrap?: boolean;
  inline?: boolean;
}) {
  return (
    <div
      className={classNames(
        "inline-flex align-middle items-center text-sm rounded-sm px-1.5 space-x-1.5 py-1 bg-current/10",
        !noTruncate && !wrap && "min-w-0 max-w-full",
        !wrap && "text-nowrap",
        inline && "-my-1",
        className,
      )}
    >
      {icon && <CIcon value={icon} sm />}
      {children}
    </div>
  );
}
