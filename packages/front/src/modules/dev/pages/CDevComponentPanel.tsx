/**
 * @file: CDevComponentPanel.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 17.10.2024
 * Last Modified Date: 17.10.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { PropsWithChildren } from "react";

import { CLine } from "@m/core/components/CLine";

export function CDevComponentPanel({ children }: PropsWithChildren) {
  return (
    <div className="divide-y divide-gray-300 dark:divide-gray-700">
      {children}
    </div>
  );
}

export function CDevComponentLine({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <CLine className="py-2">
      <div className="w-80 flex-none">{label}</div>
      <div className="grow min-w-0">{children}</div>
    </CLine>
  );
}
