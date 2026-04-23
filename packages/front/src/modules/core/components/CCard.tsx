/**
 * @file: CCard.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 07.11.2024
 * Last Modified Date: 07.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { PropsWithChildren } from "react";

import { classNames } from "@m/core/utils/classNames";

export function CCard({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div
      className={classNames(
        "rounded-md shadow-sm bg-gray-50 dark:bg-gray-800",
        className,
      )}
    >
      {children}
    </div>
  );
}
