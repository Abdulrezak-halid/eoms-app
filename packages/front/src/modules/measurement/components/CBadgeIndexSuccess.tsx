/**
 * @file: CBadgeIndexSuccess.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.09.2025
 * Last Modified Date: 09.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { CircleCheck, CircleX } from "lucide-react";

import { CBadge } from "@m/core/components/CBadge";
import { classNames } from "@m/core/utils/classNames";

export function CBadgeIndexSuccess({
  index,
  isSuccess,
}: {
  index: number;
  isSuccess?: boolean;
}) {
  return (
    <CBadge
      className={classNames(
        "flex-none font-mono font-bold",
        isSuccess === undefined
          ? undefined
          : isSuccess
            ? "text-green-700 dark:text-green-300"
            : "text-red-700 dark:text-red-300",
      )}
      icon={
        isSuccess === undefined
          ? undefined
          : isSuccess
            ? CircleCheck
            : CircleX
      }
      value={`#${index + 1}`}
    />
  );
}
