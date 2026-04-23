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
