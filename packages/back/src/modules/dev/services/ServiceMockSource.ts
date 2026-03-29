import { UtilDate } from "common";

export namespace ServiceMockSource {
  function dateToX(dt: string, intervalMs: number): number {
    const ms = UtilDate.isoDatetimeToObj(dt).getTime();
    return ms / intervalMs;
  }
  function xToDate(value: number, intervalMs: number): string {
    return UtilDate.objToIsoDatetime(new Date(value * intervalMs));
  }

  export function processWaves(data: {
    waves: { vMul: number; hMul: number }[];
    datetime: string;
    datetimeTo: string;
    intervalSecs?: number;
    cumulative?: boolean;
  }) {
    const intervalMs =
      (data.intervalSecs || 60 * 60 * 24) * // Default: 1 day
      1000;
    let x0 = dateToX(data.datetime, intervalMs);
    let x1 = dateToX(data.datetimeTo, intervalMs);
    // If it is a single date, keep time
    if (data.datetime !== data.datetimeTo) {
      x0 = Math.round(x0);
      x1 = Math.round(x1);
    }
    const result = [];

    let cumulative = 0;

    for (let x = x0; x <= x1; ++x) {
      const rate = ((Math.PI * 2) / 365) * x;
      let y = 0;
      for (const { vMul, hMul } of data.waves) {
        y += vMul * (Math.sin(hMul * rate) + 1);
      }
      if (data.cumulative) {
        cumulative += y;
        y = cumulative;
      }
      result.push({ x: xToDate(x, intervalMs), y });
    }
    return result;
  }
}
