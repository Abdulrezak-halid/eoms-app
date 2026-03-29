import { PropsWithChildren } from "react";

import { classNames } from "@m/core/utils/classNames";

export function CGridBadge({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames("flex flex-wrap @xl:max-w-64 gap-2 ", className)}
    >
      {children}
    </div>
  );
}
