/**
 * @file: CBadge.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.12.2024
 * Last Modified Date: 09.12.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";

export function CBadge({
  icon,
  value,
  description,
  className,
  noTruncate,
  wrap,
  inline,
}: {
  icon?: IconType;
  value?: string | number;
  description?: string;
  className?: string;
  noTruncate?: boolean;
  wrap?: boolean;
  inline?: boolean;
}) {
  const hasLabel = value !== undefined;
  return (
    <div
      className={classNames(
        "inline-flex align-middle items-center text-sm rounded-sm px-1.5 space-x-1.5 py-1 bg-current/10",
        !noTruncate && !wrap && "min-w-0 max-w-full",
        !wrap && "text-nowrap",
        inline && "-my-1",
        className,
      )}
      title={description || (hasLabel ? value.toString() : undefined)}
    >
      {icon && <CIcon value={icon} sm />}

      {hasLabel && (
        <div className={classNames(!noTruncate && !wrap && "truncate")}>
          {value}
        </div>
      )}
    </div>
  );
}
