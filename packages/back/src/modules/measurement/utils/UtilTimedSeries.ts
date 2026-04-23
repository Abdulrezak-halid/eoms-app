import { EApiFailCode } from "common";

import { ApiException } from "@m/core/exceptions/ApiException";
import { ITimedValue } from "@m/core/interfaces/ITimedValue";

/**
 * Methods in this namespace depends on sortable string dates.
 * So all date formats must use the same number of digits like
 * "2025-01-01T00:00:00.000Z"
 */
export namespace UtilTimedSeries {
  function byDatetimeAsc(a: ITimedValue, b: ITimedValue) {
    return a.datetime.localeCompare(b.datetime);
  }

  function diffSerieRecordCount(
    seriesOrg: ITimedValue[][],
    seriesFiltered: ITimedValue[][],
  ) {
    let result = 0;
    for (let i = 0; i < seriesOrg.length; ++i) {
      result += seriesOrg[i].values.length - seriesFiltered[i].values.length;
    }
    return result;
  }

  // Remove non-common datetimes from head and tail
  export function alignSeriesBoundaries(series: ITimedValue[][]): {
    series: ITimedValue[][];
    truncatedRecordCount: number;
  } {
    if (series.length < 2) {
      return { series, truncatedRecordCount: 0 };
    }

    // Serileri güvence için tarihine göre sırala (orijinali bozmamak adına kopya)
    const sorted = series.map((s) => [...s].sort(byDatetimeAsc));

    // Hızlı üyelik kontrolü için her seri için tarih seti
    const dateSets = sorted.map((s) => new Set(s.map((p) => p.datetime)));

    // Tüm benzersiz tarihlerin sıralı birleşimi
    const allDates = Array.from(
      new Set(sorted.flatMap((s) => s.map((p) => p.datetime))),
    ).sort();

    if (allDates.length === 0) {
      return {
        series: sorted,
        truncatedRecordCount: diffSerieRecordCount(series, sorted),
      };
    }

    const inAll = (dt: string) => dateSets.every((set) => set.has(dt));

    // Soldan: tüm serilerde bulunan ilk tarih
    let left = 0;
    while (left < allDates.length && !inAll(allDates[left])) {
      left++;
    }

    // Sağdan: tüm serilerde bulunan son tarih
    let right = allDates.length - 1;
    while (right >= 0 && !inAll(allDates[right])) {
      right--;
    }

    // Hiç ortak sınır yoksa boş seriler döndür
    if (left > right) {
      const result = sorted.map(() => []);
      return {
        series: result,
        truncatedRecordCount: diffSerieRecordCount(series, result),
      };
    }

    const start = allDates[left];
    const end = allDates[right];

    // Sadece [start, end] aralığında filtrele (içteki farklı tarihler korunur)
    const result = sorted.map((s) =>
      s.filter((p) => p.datetime >= start && p.datetime <= end),
    );
    return {
      series: result,
      truncatedRecordCount: diffSerieRecordCount(series, result),
    };
  }

  // DEPRECATED
  // // Fill missing values using linear interpolation or zero-filling for counters
  // export function fillMissingValues(series: IUtilTimeSerie[]): {
  //   series: IUtilTimeSerie[];
  //   interpolatedRecordCount: number;
  //   interpolateRate: number;
  // } {
  //   if (series.length < 2) {
  //     return { series, interpolatedRecordCount: 0, interpolateRate: 0 };
  //   }

  //   // Find all unique datetimes
  //   const allDatetimes = Array.from(
  //     new Set(series.flatMap((s) => s.values.map((p) => p.datetime))),
  //   ).sort();

  //   const resultSeries = [];
  //   let totalRecordCount = 0;
  //   let interpolatedRecordCount = 0;

  //   for (const serie of series) {
  //     const map = new Map(serie.values.map((p) => [p.datetime, p.value]));
  //     const result: ITimedValue[] = [];

  //     for (let i = 0; i < allDatetimes.length; i++) {
  //       const dt = allDatetimes[i];

  //       if (map.has(dt)) {
  //         result.push({ datetime: dt, value: map.get(dt)! });
  //       } else {
  //         // Find prev and next points for interpolation
  //         const prevIndex = serie.values.findLastIndex((p) => p.datetime < dt);
  //         const nextIndex = serie.values.findIndex((p) => p.datetime > dt);

  //         if (prevIndex === -1 || nextIndex === -1) {
  //           // If missing point is at the beginning or end, can't interpolate.
  //           //   This is unexpected case since alignSeriesBoundaries already
  //           //   cleans these values.
  //           continue;
  //         }

  //         let finalValue: number;

  //         if (serie.type === "COUNTER") {
  //           finalValue = 0;
  //         } else {
  //           const prev = serie.values[prevIndex];
  //           const next = serie.values[nextIndex];

  //           const t =
  //             (new Date(dt).getTime() - new Date(prev.datetime).getTime()) /
  //             (new Date(next.datetime).getTime() -
  //               new Date(prev.datetime).getTime());

  //           finalValue = prev.value + (next.value - prev.value) * t;
  //         }

  //         result.push({ datetime: dt, value: finalValue });
  //       }
  //     }
  //     interpolatedRecordCount += result.length - serie.values.length;
  //     totalRecordCount += result.length;
  //     resultSeries.push({ ...serie, values: result });
  //   }

  //   return {
  //     series: resultSeries,
  //     interpolatedRecordCount,
  //     interpolateRate:
  //       totalRecordCount === 0 ? 0 : interpolatedRecordCount / totalRecordCount,
  //   };
  // }

  // Checks if all series have the same datetime points
  export function checkSeriesIfAligned(series: ITimedValue[][]) {
    if (series.length < 2) {
      return;
    }

    const serieA = series[0];
    for (let iSerie = 1; iSerie < series[0].values.length; ++iSerie) {
      const serieB = series[1];
      if (serieA.length !== serieB.length) {
        throw new ApiException(
          EApiFailCode.BAD_REQUEST,
          "Not all series have the same length.",
        );
      }
      for (let i = 0; i < serieA.length; ++i) {
        if (serieA[i].datetime !== serieB[i].datetime) {
          throw new ApiException(
            EApiFailCode.BAD_REQUEST,
            "Points are not aligned respect to datetime.",
          );
        }
      }
    }
  }

  export function normalizeSeries(series: ITimedValue[][]): {
    series: ITimedValue[][];
    truncatedRecordCount: number;
    // interpolatedRecordCount: number;
    // interpolateRate: number;
  } {
    const resultAlign = alignSeriesBoundaries(series);
    checkSeriesIfAligned(resultAlign.series);
    // const resultFill = fillMissingValues(resultAlign.series);
    return {
      series: resultAlign.series,
      truncatedRecordCount: resultAlign.truncatedRecordCount,
      // interpolatedRecordCount: resultAlign.interpolatedRecordCount,
      // interpolateRate: resultAlign.interpolateRate,
    };
  }

  // Series must be normalized
  export function difference(
    normalizedSeriaA: ITimedValue[],
    normalizedSerieB: ITimedValue[],
  ) {
    if (normalizedSeriaA.length !== normalizedSerieB.length) {
      throw new ApiException(
        EApiFailCode.BAD_REQUEST,
        "Series must have the same length",
      );
    }

    return normalizedSeriaA.map((d, index) => ({
      datetime: d.datetime,
      value: d.value - normalizedSerieB[index].value,
    }));
  }

  export function cumulative(values: ITimedValue[]) {
    let acc = 0;
    return values.map((d) => {
      acc += d.value;
      return {
        datetime: d.datetime,
        value: acc,
      };
    });
  }

  export function roundHighPrecision(serie: ITimedValue[]) {
    return serie.map((v) => ({
      ...v,
      value: Math.round(v.value * 100000) / 100000,
    }));
  }

  // Series must be normalized
  export function rSquared(
    normalizedActualValues: { value: number }[],
    normalizedPredictedValues: { value: number }[],
  ) {
    // Calculate mean of actual values
    const meanActual =
      normalizedActualValues.reduce((acc, item) => acc + item.value, 0) /
      normalizedActualValues.length;

    // ssr: sum of squared residuals
    // sst: total sum of squares
    let ssr = 0;
    let sst = 0;

    for (let i = 0; i < normalizedActualValues.length; i++) {
      const actual = normalizedActualValues[i].value;
      const predicted = normalizedPredictedValues[i].value;
      ssr += Math.pow(actual - predicted, 2);
      sst += Math.pow(actual - meanActual, 2);
    }

    // R² = 1 - (SS_res / SS_total)
    const rSquare = 1 - ssr / sst;

    // Round to 3 decimal places for cleaner output
    return Math.round(rSquare * 1000) / 1000;
  }

  // Series must be normalized
  export function rmse(
    normalizedActualValues: { value: number }[],
    normalizedPredictedValues: { value: number }[],
  ) {
    let ssr = 0;

    for (let i = 0; i < normalizedActualValues.length; i++) {
      const diff =
        normalizedActualValues[i].value - normalizedPredictedValues[i].value;
      ssr += diff * diff;
    }

    const mse = ssr / normalizedActualValues.length;
    const value = Math.sqrt(mse);
    const rounded = value < 0.01 ? 0 : value;
    return Math.round(rounded * 1000) / 1000;
  }
}
