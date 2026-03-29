/**
 * @file: CModal.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 27.11.2024
 * Last Modified Date: 27.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { MouseEvent, PropsWithChildren, useCallback } from "react";
import { createPortal } from "react-dom";

import { classNames } from "../utils/classNames";
import { CPopupPanel } from "./CPopupPanel";

export function CModal({
  onClickBg,
  children,
  lg,
}: PropsWithChildren<{ onClickBg?: () => void; lg?: boolean }>) {
  const handleClickBg = useCallback(
    (e: MouseEvent) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      onClickBg?.();
    },
    [onClickBg],
  );

  return createPortal(
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-300/70 dark:bg-gray-950/70 z-20 p-2 @sm:p-4"
      onClick={handleClickBg}
    >
      <CPopupPanel
        className={classNames(
          "p-4 max-w-full max-h-full overflow-y-auto",
          lg ? "w-md" : "w-xs",
        )}
        modal
      >
        {children}
      </CPopupPanel>
    </div>,
    document.body,
  );
}
