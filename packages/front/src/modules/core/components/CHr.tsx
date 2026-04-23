/**
 * @file: CHr.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.05.2025
 * Last Modified Date: 11.05.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { classNames } from "../utils/classNames";

export function CHr({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "border-b border-gray-300 dark:border-gray-600",
        className,
      )}
    />
  );
}
