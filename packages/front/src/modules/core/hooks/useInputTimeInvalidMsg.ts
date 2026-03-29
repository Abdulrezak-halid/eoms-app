import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { timePartsToStr, useInputTimeParts } from "./useInputTimeParts";

export function useInputTimeInvalidMsg(
  value?: string,
  disabled?: boolean,
  required?: boolean,
  min?: string,
  max?: string,
) {
  const { t } = useTranslation();

  const { valueParts, minParts, maxParts } = useInputTimeParts(value, min, max);

  return useMemo(() => {
    if (disabled) {
      return "";
    }
    if (required && !value) {
      return t("required");
    }
    if (
      valueParts &&
      minParts &&
      (valueParts[0] < minParts[0] ||
        (valueParts[0] === minParts[0] &&
          (valueParts[1] < minParts[1] ||
            (valueParts[1] === minParts[1] && valueParts[2] < minParts[2]))))
    ) {
      return t("invalidTimeMin", { value: timePartsToStr(minParts) });
    }
    if (
      valueParts &&
      maxParts &&
      (valueParts[0] > maxParts[0] ||
        (valueParts[0] === maxParts[0] &&
          (valueParts[1] > maxParts[1] ||
            (valueParts[1] === maxParts[1] && valueParts[2] > maxParts[2]))))
    ) {
      return t("invalidTimeMax", { value: timePartsToStr(maxParts) });
    }
    return "";
  }, [disabled, required, value, valueParts, minParts, maxParts, t]);
}
