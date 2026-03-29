import { classNames } from "@m/core/utils/classNames";
import { PropsWithChildren } from "react";

export function CLine({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames("flex items-center", className)}>{children}</div>
  );
}
