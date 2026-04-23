/**
 * @file: useInputDateInvalidMsg.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.09.2025
 * Last Modified Date: 09.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { UtilDate } from "common";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

export function useInputDateInvalidMsg(
  value?: string,
  disabled?: boolean,
  required?: boolean,
  min?: string,
  max?: string,
) {
  const { t } = useTranslation();

  return useMemo(() => {
    if (disabled) {
      return "";
    }
    if (required && !value) {
      return t("required");
    }
    const valueDate = value && UtilDate.localIsoDateToObj(value);
    const minDate = min && UtilDate.localIsoDateToObj(min);
    if (valueDate && minDate && valueDate.getTime() < minDate.getTime()) {
      return t("invalidDateMin", { value: min });
    }
    const maxDate = max && UtilDate.localIsoDateToObj(max);
    if (valueDate && maxDate && valueDate.getTime() > maxDate.getTime()) {
      return t("invalidDateMax", { value: max });
    }
    return "";
  }, [value, required, min, max, t, disabled]);
}
