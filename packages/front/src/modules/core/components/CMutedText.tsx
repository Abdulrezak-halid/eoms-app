import { PropsWithChildren } from "react";

import { classNames } from "../utils/classNames";

export function CMutedText({
  value,
  children,
  className,
  wrap,
}: PropsWithChildren<{ value?: string; className?: string; wrap?: boolean }>) {
  return (
    <span
      className={classNames("opacity-75", !wrap && "text-nowrap", className)}
    >
      {value || children}
    </span>
  );
}
