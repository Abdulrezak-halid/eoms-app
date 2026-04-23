/**
 * @file: CCardTitle.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 18.11.2024
 * Last Modified Date: 18.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { classNames } from "@m/core/utils/classNames";

export function CCardTitle({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "font-bold overflow-hidden text-nowrap text-ellipsis text-gray-600 dark:text-gray-300",
        className,
      )}
    >
      {value}
    </div>
  );
}
