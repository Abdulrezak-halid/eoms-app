import { UtilDate } from "common";
import { useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { strDuration } from "@m/base/utils/strDuration";
import { CMutedText } from "@m/core/components/CMutedText";
import { classNames } from "@m/core/utils/classNames";

export function CDisplayDateAgo({
  value,
  clientMinusServerTime = 0,
  className,
}: {
  value: string | null;
  // It is requested to remind this is important
  //   Also original secs is used to show original date
  clientMinusServerTime?: number;
  className?: string;
}) {
  const { t } = useTranslation();

  const secs = useMemo(
    () =>
      value === null
        ? 0
        : Math.floor(UtilDate.isoDatetimeToObj(value).getTime() / 1000) +
          clientMinusServerTime,
    [clientMinusServerTime, value],
  );

  const str = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const duration = now - secs;
    // Skip seconds
    if (duration < 60) {
      return t("timeJustNow");
    }
    if (duration < 120) {
      return t("timeDuration", {
        dur: `1${t("timeMinuteShort")}`,
      });
    }
    return t("timeDuration", {
      dur: strDuration(duration, t),
    });
  }, [secs, t]);

  // Show real date, not the date with offset
  const titleDate = useMemo(
    () => (value === null ? "" : UtilDate.formatUtcIsoToLocalDatetime(value)),
    [value],
  );

  if (value === null) {
    return <CMutedText value="-" />;
  }

  return (
    <span className={classNames("text-nowrap", className)} title={titleDate}>
      {str}
    </span>
  );
}
