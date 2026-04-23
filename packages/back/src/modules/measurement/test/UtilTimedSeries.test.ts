import { describe, expect, it } from "vitest";

import { ITimedValue } from "@m/core/interfaces/ITimedValue";

import { UtilTimedSeries } from "../utils/UtilTimedSeries";

describe("UtilTimedSeries", () => {
  it("alignSeriesBoundaries should trim start and end to common datetime range", () => {
    const seriesA: ITimedValue[] = [
      { datetime: "2023-01-01T00:00:00Z", value: 10 },
      { datetime: "2023-01-02T00:00:00Z", value: 20 },
      { datetime: "2023-01-03T00:00:00Z", value: 30 },
    ];

    const seriesB: ITimedValue[] = [
      { datetime: "2023-01-02T00:00:00Z", value: 100 },
      { datetime: "2023-01-03T00:00:00Z", value: 200 },
      { datetime: "2023-01-04T00:00:00Z", value: 300 },
    ];

    const result = UtilTimedSeries.alignSeriesBoundaries([seriesA, seriesB]);

    expect(result).toStrictEqual({
      series: [
        [
          { datetime: "2023-01-02T00:00:00Z", value: 20 },
          { datetime: "2023-01-03T00:00:00Z", value: 30 },
        ],
        [
          { datetime: "2023-01-02T00:00:00Z", value: 100 },
          { datetime: "2023-01-03T00:00:00Z", value: 200 },
        ],
      ],
      truncatedRecordCount: 0,
    });
  });

  it("alignSeriesBoundaries should trim recurring uncommon datetimes", () => {
    const seriesA: ITimedValue[] = [
      { datetime: "2025-01-01T00:00:00.000Z", value: 3.4 },
      { datetime: "2025-01-02T00:00:00.000Z", value: 15 },
      { datetime: "2025-01-03T00:00:00.000Z", value: 5 },
    ];

    const seriesB: ITimedValue[] = [
      { datetime: "2025-01-01T00:00:00.000Z", value: 17.8 },
      { datetime: "2025-01-02T00:00:00.000Z", value: 2.8 },
      { datetime: "2025-01-04T00:00:00.000Z", value: 12.3 },
    ];

    const result = UtilTimedSeries.alignSeriesBoundaries([seriesA, seriesB]);

    expect(result).toStrictEqual({
      series: [
        [
          { datetime: "2025-01-01T00:00:00.000Z", value: 3.4 },
          { datetime: "2025-01-02T00:00:00.000Z", value: 15 },
        ],
        [
          { datetime: "2025-01-01T00:00:00.000Z", value: 17.8 },
          { datetime: "2025-01-02T00:00:00.000Z", value: 2.8 },
        ],
      ],
      truncatedRecordCount: 0,
    });
  });

  // DEPRECATED
  // it("fillMissingValues should interpolate missing values", () => {
  //   const seriesReference: ITimedValue[] = [
  //     { datetime: "2023-01-01T00:00:00Z", value: 100 },
  //     { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //     { datetime: "2023-01-04T00:00:00Z", value: 400 },
  //   ];
  //   const seriesWithGap: ITimedValue[] = [
  //     { datetime: "2023-01-01T00:00:00Z", value: 10 },
  //     { datetime: "2023-01-04T00:00:00Z", value: 40 },
  //   ];

  //   const result = UtilTimedSeries.fillMissingValues([
  //     { type: "GAUGE", values: seriesReference },
  //     { type: "GAUGE", values: seriesWithGap },
  //   ]);

  //   expect(result).toStrictEqual({
  //     series: [
  //       {
  //         type: "GAUGE",
  //         values: [
  //           { datetime: "2023-01-01T00:00:00Z", value: 100 },
  //           { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //           { datetime: "2023-01-04T00:00:00Z", value: 400 },
  //         ],
  //       },
  //       {
  //         type: "GAUGE",
  //         values: [
  //           { datetime: "2023-01-01T00:00:00Z", value: 10 },
  //           { datetime: "2023-01-02T00:00:00Z", value: 20 }, // interpolated
  //           { datetime: "2023-01-04T00:00:00Z", value: 40 },
  //         ],
  //       },
  //     ],
  //     interpolatedRecordCount: 1,
  //     interpolateRate: 1 / 6,
  //   });
  // });

  it("normalizeSeries should align multiple series", () => {
    const seriesA: ITimedValue[] = [
      { datetime: "2023-01-01T00:00:00Z", value: 10 },
      { datetime: "2023-01-02T00:00:00Z", value: 20 },
      { datetime: "2023-01-05T00:00:00Z", value: 50 },
      { datetime: "2023-01-06T00:00:00Z", value: 60 },
    ];

    const seriesB: ITimedValue[] = [
      { datetime: "2023-01-02T00:00:00Z", value: 200 },
      { datetime: "2023-01-05T00:00:00Z", value: 300 },
      { datetime: "2023-01-06T00:00:00Z", value: 600 },
      { datetime: "2023-01-07T00:00:00Z", value: 700 },
    ];

    const result = UtilTimedSeries.normalizeSeries([seriesA, seriesB]);

    expect(result).toEqual({
      series: [
        [
          { datetime: "2023-01-02T00:00:00Z", value: 20 },
          { datetime: "2023-01-05T00:00:00Z", value: 50 },
          { datetime: "2023-01-06T00:00:00Z", value: 60 },
        ],
        [
          { datetime: "2023-01-02T00:00:00Z", value: 200 },
          { datetime: "2023-01-05T00:00:00Z", value: 300 }, // interpolated
          { datetime: "2023-01-06T00:00:00Z", value: 600 },
        ],
      ],
      truncatedRecordCount: 0,
      // interpolatedRecordCount: 2,
      // interpolateRate: 2 / 8,
    });
  });

  // DEPRECATED
  // it("normalizeSeries should align and interpolate multiple series", () => {
  //   const seriesA: ITimedValue[] = [
  //     { datetime: "2023-01-01T00:00:00Z", value: 10 },
  //     { datetime: "2023-01-02T00:00:00Z", value: 20 },
  //     { datetime: "2023-01-05T00:00:00Z", value: 50 },
  //     { datetime: "2023-01-06T00:00:00Z", value: 60 },
  //   ];

  //   const seriesB: ITimedValue[] = [
  //     { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //     { datetime: "2023-01-03T00:00:00Z", value: 300 },
  //     { datetime: "2023-01-06T00:00:00Z", value: 600 },
  //     { datetime: "2023-01-07T00:00:00Z", value: 700 },
  //   ];

  //   const result = UtilTimedSeries.normalizeSeries([
  //     { type: "GAUGE", values: seriesA },
  //     { type: "GAUGE", values: seriesB },
  //   ]);

  //   expect(result).toEqual({
  //     series: [
  //       {
  //         type: "GAUGE",
  //         values: [
  //           { datetime: "2023-01-02T00:00:00Z", value: 20 },
  //           { datetime: "2023-01-03T00:00:00Z", value: 30 }, // interpolated
  //           { datetime: "2023-01-05T00:00:00Z", value: 50 },
  //           { datetime: "2023-01-06T00:00:00Z", value: 60 },
  //         ],
  //       },
  //       {
  //         type: "GAUGE",
  //         values: [
  //           { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //           { datetime: "2023-01-03T00:00:00Z", value: 300 },
  //           { datetime: "2023-01-05T00:00:00Z", value: 500 }, // interpolated
  //           { datetime: "2023-01-06T00:00:00Z", value: 600 },
  //         ],
  //       },
  //     ],
  //     truncatedRecordCount: 2,
  //     interpolatedRecordCount: 2,
  //     interpolateRate: 2 / 8,
  //   });
  // });

  // DEPRECATED
  // it("normalizeSeries should align and interpolate multiple series with counter metric", () => {
  //   const seriesA: ITimedValue[] = [
  //     { datetime: "2023-01-01T00:00:00Z", value: 10 },
  //     { datetime: "2023-01-02T00:00:00Z", value: 20 },
  //     { datetime: "2023-01-05T00:00:00Z", value: 50 },
  //     { datetime: "2023-01-06T00:00:00Z", value: 60 },
  //   ];

  //   const seriesB: ITimedValue[] = [
  //     { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //     { datetime: "2023-01-03T00:00:00Z", value: 300 },
  //     { datetime: "2023-01-06T00:00:00Z", value: 600 },
  //     { datetime: "2023-01-07T00:00:00Z", value: 700 },
  //   ];

  //   const result = UtilTimedSeries.normalizeSeries([
  //     { type: "COUNTER", values: seriesA },
  //     { type: "COUNTER", values: seriesB },
  //   ]);

  //   expect(result).toEqual({
  //     series: [
  //       {
  //         type: "COUNTER",
  //         values: [
  //           { datetime: "2023-01-02T00:00:00Z", value: 20 },
  //           { datetime: "2023-01-03T00:00:00Z", value: 0 }, // filled with zero
  //           { datetime: "2023-01-05T00:00:00Z", value: 50 },
  //           { datetime: "2023-01-06T00:00:00Z", value: 60 },
  //         ],
  //       },
  //       {
  //         type: "COUNTER",
  //         values: [
  //           { datetime: "2023-01-02T00:00:00Z", value: 200 },
  //           { datetime: "2023-01-03T00:00:00Z", value: 300 },
  //           { datetime: "2023-01-05T00:00:00Z", value: 0 }, // filled with zero
  //           { datetime: "2023-01-06T00:00:00Z", value: 600 },
  //         ],
  //       },
  //     ],
  //     truncatedRecordCount: 2,
  //     interpolatedRecordCount: 2,
  //     interpolateRate: 2 / 8,
  //   });
  // });
});
