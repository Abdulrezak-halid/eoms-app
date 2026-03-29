/**
 * @file: useDatetimeParts.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 10.09.2025
 * Last Modified Date: 10.09.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
