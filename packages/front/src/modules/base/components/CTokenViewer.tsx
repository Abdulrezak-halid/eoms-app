import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";

import { CButton } from "@m/core/components/CButton";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

export function CTokenViewer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const isCopySupported =
    window.location.hostname === "localhost" ||
    window.location.protocol === "https:";

  const [visible, setVisibility] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleVisibility = useCallback(() => {
    setVisibility((d) => !d);
  }, []);

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard
        .writeText(value)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [value]);

  const getDisplayValue = () => {
    if (visible) {
      return value;
    }
    return "•".repeat(Math.min(value.length, 44));
  };

  const displayValue = getDisplayValue();

  return (
    <div className={classNames("flex items-stretch gap-2 w-full", className)}>
      <div className="flex items-center px-3 py-1.5 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 flex-1 min-w-0 overflow-auto">
        <code className="block whitespace-nowrap">{displayValue}</code>
      </div>

      <CButton
        icon={visible ? EyeOff : Eye}
        label={t("show")}
        onClick={toggleVisibility}
        noTab
        hideLabelLg
      />

      <CButton
        icon={copied ? Check : Copy}
        label={t("copy")}
        onClick={handleCopy}
        className={copied ? "text-green-600 dark:text-green-400" : ""}
        disabled={!isCopySupported}
        noTab
        hideLabelLg
      />
    </div>
  );
}
