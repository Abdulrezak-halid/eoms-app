import { useMemo } from "react";

import timezoneData from "@m/base/assets/timezone.json";
import { ISelectListItem } from "@m/core/components/CSelectList";

function formatOffsetWithMinutes(hours: number): string {
  const sign = hours >= 0 ? "+" : "-";
  const abs = Math.abs(hours);
  const wholeHours = Math.floor(abs);
  const minutes = Math.round((abs - wholeHours) * 60);

  return `${sign}${wholeHours}:${minutes.toString().padStart(2, "0")}`;
}

export function useTimezoneList(): ISelectListItem<string>[] {
  return useMemo(
    () =>
      timezoneData
        .flatMap((d) =>
          d.utc.map((name) => ({
            label: `(${formatOffsetWithMinutes(d.offset)}) ${name}`,
            value: name,
            offset: d.offset,
          })),
        )
        .sort((a, b) =>
          a.offset === b.offset
            ? a.label.localeCompare(b.label)
            : a.offset - b.offset,
        ),
    [],
  );
}

/** @example getCurrentTimezone() => "Europe/Istanbul" */
export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
