/**
 * @file: CMutedText.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.11.2024
 * Last Modified Date: 09.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
