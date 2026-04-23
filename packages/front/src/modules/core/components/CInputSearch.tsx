import { Search } from "lucide-react";
import { KeyboardEvent } from "react";

import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

import { CInputString } from "./CInputString";

export function CInputSearch({
  value,
  onChange,
  className,
  placeholder,
  autoFocus,
  onKeyDown,
  noCleanButton,
  showShortcutHint,
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  noCleanButton?: boolean;
  showShortcutHint?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <CInputString
      icon={Search}
      value={value}
      onChange={onChange}
      className={classNames(showShortcutHint && "flex items-center", className)}
      classNameInput={showShortcutHint ? "pr-16" : undefined}
      placeholder={
        placeholder ?? (showShortcutHint ? t("searchOrGoTo") : t("search"))
      }
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      noCleanButton={noCleanButton}
    >
      {showShortcutHint && (
        <div className="mr-2 px-2 py-0.5 rounded border border-gray-300 dark:border-gray-500 text-xs font-semibold text-gray-500 dark:text-gray-300 select-none">
          /
        </div>
      )}
    </CInputString>
  );
}
