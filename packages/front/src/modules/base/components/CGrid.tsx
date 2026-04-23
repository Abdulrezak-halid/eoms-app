
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
