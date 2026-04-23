/**
 * @file: CGrid.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.11.2024
 * Last Modified Date: 11.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */

import { PropsWithChildren } from "react";

export function CGrid({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="*:inline-block *:align-top *:mr-2 *:mb-2 -mr-2 -mb-2">
        {children}
      </div>
    </div>
  );
}
