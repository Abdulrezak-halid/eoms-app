/**
 * @file: CPopupPanel.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 17.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { PropsWithChildren } from "react";

import { classNames } from "@m/core/utils/classNames";

export function CPopupPanel({
  className,
  children,
  modal,
  inline,
}: PropsWithChildren<{
  className?: string;
  modal?: boolean;
  inline?: boolean;
}>) {
  return (
    <div
      className={classNames(
        "bg-gray-50 dark:bg-gray-800",
        !inline && "border border-gray-200 dark:border-gray-900 shadow-md",
        !inline && (modal ? "rounded-xl" : "rounded-md"),
        className,
      )}
    >
      {children}
    </div>
  );
}
