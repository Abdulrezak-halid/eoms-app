/**
 * @file: CLine.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 17.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

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
