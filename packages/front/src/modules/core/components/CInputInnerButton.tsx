import { KeyboardEvent, MouseEvent, useCallback } from "react";

import { classNames } from "../utils/classNames";
import { CIcon, IconType } from "./CIcon";

export function CInputInnerButton({
  ariaLabel,
  icon,
  onClick,
  className,
}: {
  ariaLabel?: string;
  icon: IconType;
  onClick: () => void;
  className?: string;
}) {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick],
  );

  const handleFocusKey = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Space" || e.code === "Enter") {
      e.currentTarget.click();
    }
  }, []);

  return (
    <div
      className={classNames(
        "w-12 h-12 flex-none flex items-center justify-center cursor-pointer outline-none",
        "focus:bg-accent-500/10 hover:bg-accent-500/10",
        "group-disabled:pointer-events-none",
        className,
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleFocusKey}
    >
      <CIcon
        value={icon}
        className="w-12! text-accent-700 dark:text-accent-200"
      />
    </div>
  );
}
