
export namespace UtilDate {
  // Format -------------------------------------------------------
  // TODO no default locale
  export function formatObjToLocalDate(value: Date, locale: string = "tr") {
    return Intl.DateTimeFormat(locale).format(value);
  }
  export function formatLocalIsoDateToLocalDate(value: string) {
    return formatObjToLocalDate(localIsoDateToObj(value));
  }
  // TODO no default locale
  export function formatUtcIsoDateToLocalDate(
    value: string,
    locale: string = "tr",
  ) {
    return formatObjToLocalDate(isoDatetimeToObj(value), locale);
  }
  export function formatUtcIsoToLocalDatetime(
    value: string,
    options?: { withSeconds?: boolean },
  ) {
    // TODO localization
    return Intl.DateTimeFormat("tr", {
      // dateStyle: "short",
      // timeStyle: "medium",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: options?.withSeconds ? "2-digit" : undefined,
    }).format(isoDatetimeToObj(value));
  }

  // To ISO -------------------------------------------------------
  export function objToLocalIsoDate(value: Date) {
    return `${value.getFullYear()}-${(value.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${value.getDate().toString().padStart(2, "0")}`;
  }
  export function objToUtcIsoDate(value: Date) {
    return `${value.getUTCFullYear()}-${(value.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${value.getUTCDate().toString().padStart(2, "0")}`;
  }
  export function localIsoDateToIsoDatetime(value: string) {
    return objToIsoDatetime(localIsoDateToObj(value));
  }
  export function objToIsoDatetime(value: Date) {
    return value.toISOString(); // .replace(/\.\d+Z$/, "Z");
  }
  export function isoDatetimeToUtcAsTimezoneIsoDatetime(
    dateValue: string,
    tzOffset: number,
  ): string {
    // dateValue Z veya +HH:MM formatında olabilir
    const date = new Date(dateValue);

    // offset string -> float (örnek: "+3" => 3, "-3.5" => -3.5)
    const offsetM = tzOffset * 60;

    // date.getTime() zaten UTC timestamp (ms)
    const targetTime = new Date(date.getTime() + offsetM * 60_000);

    // Build offset string
    // const sign = tz >= 0 ? "+" : "-";
    // const hours = String(Math.floor(Math.abs(tz))).padStart(2, "0");
    // const minutes = String(Math.abs(offsetM % 60)).padStart(2, "0");
    // const offsetString = `${sign}${hours}:${minutes}`;

    // ISO string -> "YYYY-MM-DDTHH:mm:ss.sss+HH:MM"
    return targetTime.toISOString(); //.replace("Z", offsetString);
  }

  export function timezoneIsoDatetimeToUtcIsoDatetime(
    dateValue: string,
    tzOffset: number,
  ): string {
    const date = new Date(dateValue);
    const offsetM = tzOffset * 60;
    const targetTime = new Date(date.getTime() - offsetM * 60_000);
    return targetTime.toISOString();
  }

  // To Time -------------------------------------------------------
  export function objToLocalTime(value: Date) {
    return `${value.getHours().toString().padStart(2, "0")}:${value
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${value.getSeconds().toString().padStart(2, "0")}`;
  }

  // To Object -------------------------------------------------------
  export function localIsoDateToObj(value: string) {
    const date = new Date(value);
    date.setHours(date.getUTCHours());
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    return date;
  }
  export function isoDatetimeToObj(value: string) {
    return new Date(value);
  }

  // To Number (Linux Timestamp) -------------------------------------------------------
  export function strToNumber(value: string) {
    return new Date(value).getTime();
  }

  // Get Now -------------------------------------------------------
  export function getNowUtcIsoDate() {
    return UtilDate.objToUtcIsoDate(new Date());
  }
  export function getNowIsoDatetime() {
    return UtilDate.objToIsoDatetime(new Date());
  }
  export function getYesterdayUtcIsoDate() {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return UtilDate.objToUtcIsoDate(yesterday);
  }

  // Get Day Difference -----------------------------------------------
  export function getDayCount(datetimes: string[]) {
    if (datetimes.length === 0) {
      return 0;
    }

    const dates = datetimes.map((dt) => isoDatetimeToObj(dt));
    const firstDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const lastDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const diffInMs = lastDate.getTime() - firstDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }

  // Timezone -------------------------------------------------------
  /** @example getTimezoneOffset("America/New_York") => -5 */
  // Throw error if timezone is invalid
  export function getTimezoneOffset(zone: string): number {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(now.toLocaleString("en-US", { timeZone: zone }));
    const offsetMinutes = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
    return offsetMinutes / 60;
  }
}
