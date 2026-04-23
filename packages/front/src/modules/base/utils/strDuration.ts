import type { TranslationKey } from "@tolgee/react";

export function strDuration(
  secs: number,
  t: (key: TranslationKey) => string,
): string {
  return secs >= 86400
    ? `${Math.floor(secs / 86400)}${t("timeDayShort")}`
    : secs >= 7200
      ? `${Math.floor(secs / 3600)}${t("timeHourShort")}`
      : secs >= 3600
        ? `1${t("timeHourShort")} ${Math.ceil((secs - 3600) / 60)}${t(
            "timeMinuteShort",
          )}`
        : secs >= 120
          ? `${Math.floor(secs / 60)}${t("timeMinuteShort")}`
          : secs > 60
            ? `1${t("timeMinuteShort")} ${secs - 60}${t("timeSecondShort")}`
            : `${Math.max(0, secs)}${t("timeSecondShort")}`;
}
