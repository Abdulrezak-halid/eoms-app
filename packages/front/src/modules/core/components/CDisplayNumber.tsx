import { useMemo } from "react";

import { classNames } from "../utils/classNames";
import { CMutedText } from "./CMutedText";

export function CDisplayNumber({
  value,
  className,
  placeholder = "-",
  maxDecimals = 2,
  minDecimals,
  unitStr,
}: {
  value?: number | null;
  className?: string;
  placeholder?: string;
  maxDecimals?: number;
  minDecimals?: number;
  unitStr?: string;
}) {
  const displayValue = useMemo(() => {
    if (value === null || value === undefined) {
      return;
    }

    return Intl.NumberFormat("tr", {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: minDecimals,
    }).format(value);
  }, [value, maxDecimals, minDecimals]);

  if (value === null || value === undefined) {
    return <CMutedText value={placeholder} />;
  }

  return (
    <span
      className={classNames(
        "font-mono text-nowrap",
        value === 0
          ? "text-gray-500 dark:text-gray-400"
          : value > 0
            ? "text-lime-700 dark:text-lime-300"
            : "text-rose-800 dark:text-rose-400",
        className,
      )}
      title={value.toString()}
    >
      {displayValue} {unitStr}
    </span>
  );
}
