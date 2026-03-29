import { UtilDate } from "common";
import { useMemo } from "react";

export function useDatetimeParts(value?: string) {
  return useMemo(() => {
    if (!value) {
      return ["", ""] as const;
    }
    const date = new Date(value);
    return [
      UtilDate.objToLocalIsoDate(date),
      UtilDate.objToLocalTime(date),
    ] as const;
  }, [value]);
}
