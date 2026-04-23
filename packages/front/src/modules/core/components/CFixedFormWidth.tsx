import { PropsWithChildren } from "react";

import { classNames } from "../utils/classNames";

export function CFixedFormWidth({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames("max-w-sm @container", className)}>
      {children}
    </div>
  );
}
