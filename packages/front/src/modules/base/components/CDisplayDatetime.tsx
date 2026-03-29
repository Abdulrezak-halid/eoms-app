import { UtilDate } from "common";
import { useMemo } from "react";

export function CDisplayDate({ value }: { value: string }) {
  const formattedValue = useMemo(
    () => UtilDate.formatLocalIsoDateToLocalDate(value),
    [value],
  );
  return <span className="font-mono">{formattedValue}</span>;
}

export function CDisplayDatetime({
  value,
  withSeconds,
}: {
  value: string;
  withSeconds?: boolean;
}) {
  const formattedValue = useMemo(
    () => UtilDate.formatUtcIsoToLocalDatetime(value, { withSeconds }),
    [value, withSeconds],
  );
  return <span className="font-mono">{formattedValue}</span>;
}
