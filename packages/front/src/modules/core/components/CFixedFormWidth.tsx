/**
 * @file: CFixedFormWidth.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 04.06.2025
 * Last Modified Date: 04.06.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
