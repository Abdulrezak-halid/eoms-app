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
