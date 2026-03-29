import { Chart, Tick, TimeUnit, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { useContext, useEffect, useMemo, useRef } from "react";

import { CNoRecord } from "@m/core/components/CNoRecord";
import { ContextTheme } from "@m/core/contexts/ContextTheme";
import { classNames } from "@m/core/utils/classNames";

import {
  IChartDataColor,
  chartColorInfos,
  defaultChartColors,
} from "../utils/chartColors";
import { chartComputePointRadii } from "../utils/chartComputePointRadii";
import { reverseLegendPlugin } from "../utils/chartLegendPlugin";

Chart.register(...registerables, reverseLegendPlugin);

export type IChartType = "line" | "scatter";

export type IChartSerieData =
  | { x: string; y: number }[]
  | { x: number; y: number }[];

export type IChartSeries = {
  type?: IChartType;
  color?: IChartDataColor;
  name: string;
  data: IChartSerieData;
}[];

export function CChart({
  series,
  type = "line",
  individualTooltipMode,
  isXNumeric,
  hideLegends,
  heightFull,
  unitStr,
  xAxisUnitStr,
  decimalsMin,
  decimalsMax = 3,
  datetimeMin,
  datetimeMax,
  disableInteractiveLegend,
  maxSpanMins,
}: {
  series?: IChartSeries;
  type?: IChartType;
  individualTooltipMode?: boolean;
  isXNumeric?: boolean;
  hideLegends?: boolean;
  heightFull?: boolean;
  unitStr?: string;
  xAxisUnitStr?: string;
  decimalsMin?: number;
  decimalsMax?: number;
  datetimeMin?: string;
  datetimeMax?: string;
  disableInteractiveLegend?: boolean;
  maxSpanMins?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const { dark } = useContext(ContextTheme);

  const noRecord = useMemo(() => {
    return (
      !series || series.length === 0 || series.every((s) => s.data.length === 0)
    );
  }, [series]);

  // If series are not aligned, popup worked with "index" mode is bugged,
  //   so missing values are filled with null.
  const seriesAligned = useMemo(() => {
    if (!series || individualTooltipMode) {
      return series;
    }
    const allX = [
      ...new Set(series.flatMap((serie) => serie.data.map((d) => d.x))),
    ];
    allX.sort();

    return series.map((serie) => ({
      ...serie,
      data: allX.map((x) => ({
        x,
        y: serie.data.find((d) => d.x === x)?.y ?? null,
      })),
    }));
  }, [series, individualTooltipMode]);

  const timeUnit = useMemo((): TimeUnit | undefined => {
    if (
      isXNumeric ||
      noRecord ||
      !seriesAligned ||
      seriesAligned[0].data.length < 2
    ) {
      return undefined;
    }

    const serieData = seriesAligned[0].data;

    const firstDataPoint = serieData[0];
    const secondDataPoint = serieData[serieData.length - 1];

    if (
      typeof firstDataPoint.x !== "string" ||
      typeof secondDataPoint.x !== "string"
    ) {
      return "day";
    }

    const date1 = new Date(firstDataPoint.x).getTime();
    const date2 = new Date(secondDataPoint.x).getTime();
    const diffMilliseconds = Math.abs(date2 - date1);

    const hour = 60 * 60 * 1000;

    if (diffMilliseconds > 48 * hour) {
      return "day";
    }
    if (diffMilliseconds > 6 * hour) {
      return "hour";
    }

    return "minute";
  }, [seriesAligned, isXNumeric, noRecord]);

  // Datetime range will not refresh the chart alone, need to change
  //   series as well
  // TODO remove this section when datetime is integrated into series
  const refDatetimeMin = useRef(datetimeMin);
  const refDatetimeMax = useRef(datetimeMax);
  useEffect(() => {
    refDatetimeMin.current = datetimeMin;
    refDatetimeMax.current = datetimeMax;
  }, [datetimeMin, datetimeMax]);

  useEffect(() => {
    if (!ref.current || noRecord || !seriesAligned) {
      return;
    }

    const ctx = ref.current;

    const autoDecimalFormat = (ticks: Tick[]) => {
      const maxDigit = ticks.reduce(
        (a, c) => Math.max(c.value.toString().split(".")[1]?.length || 0, a),
        0,
      );
      for (const tick of ticks) {
        const formatted = Intl.NumberFormat("tr", {
          maximumFractionDigits: decimalsMax,
          minimumFractionDigits:
            decimalsMin ??
            (decimalsMax === undefined
              ? undefined
              : Math.min(maxDigit, decimalsMax)),
        }).format(tick.value);

        tick.label = formatted;
      }
    };

    const chart = new Chart(ctx, {
      type,
      data: {
        // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: seriesAligned.map((d, iSerie) => {
          const colorInfo =
            chartColorInfos[
              d.color || defaultChartColors[iSerie % defaultChartColors.length]
            ];
          const color = dark ? colorInfo.dark : colorInfo.light;

          const isScatter = type === "scatter" || d.type === "scatter";

          const pointRadius = isScatter
            ? undefined
            : chartComputePointRadii(
                d.data as { x: string | number; y: number | null }[],
                3,
                // show all points only when dataset is small
                d.data.length < 10,
                maxSpanMins,
              );

          return {
            label: d.name,
            type: d.type,
            borderColor: color,
            backgroundColor: color,

            // Default is 3
            // borderWidth: 2,

            // Scatter always shows circles at fixed radius.
            // For line charts a per-point array is used so that isolated
            // points (no visible line connection on either side) are still
            // rendered as circles even when the dataset is large.
            pointStyle: "circle",
            // For scatter points, radius 5, for line points it is 3
            radius: isScatter ? 5 : 3,
            pointRadius,

            data:
              type === "scatter"
                ? d.data.map((v, i) => ({
                    x: typeof v.x === "number" ? v.x : i,
                    y: v.y,
                  }))
                : d.data,
          };
        }),
      },
      options: {
        datasets: {
          line: {
            borderJoinStyle: "round",

            // If gap between 2 points is greater then "maxSpanMins" do not
            //   connect lines.
            segment: maxSpanMins
              ? {
                  borderColor: (context) => {
                    const x0 = context.p0.parsed.x;
                    const x1 = context.p1.parsed.x;

                    if (typeof x0 === "number" && typeof x1 === "number") {
                      const diffMs = Math.abs(x1 - x0);
                      const diffMin = diffMs / (1000 * 60);
                      if (diffMin > maxSpanMins) {
                        return "transparent";
                      }
                    }

                    return undefined;
                  },
                }
              : undefined,
          },
        },

        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode:
            type === "scatter" || individualTooltipMode ? undefined : "index",
        },
        scales: {
          x: {
            grid: {
              color: dark
                ? "oklch(37.2% 0.044 257.287)"
                : "oklch(92.9% 0.013 255.508)",
            },
            ticks: {
              color: dark
                ? "oklch(86.9% 0.022 252.894)"
                : "oklch(37.2% 0.044 257.287)",
              autoSkip: false,
              autoSkipPadding: 10,
              maxRotation: 0,
            },
            border: {
              display: false,
              // color: "red",
            },
            afterTickToLabelConversion: function ({ ticks }) {
              if (isXNumeric) {
                autoDecimalFormat(ticks);
              }
            },
            title: {
              display: !!(xAxisUnitStr && isXNumeric),
              text: xAxisUnitStr,
              color: dark
                ? "oklch(86.9% 0.022 252.894)"
                : "oklch(37.2% 0.044 257.287)",
            },
            ...(type === "scatter" || isXNumeric
              ? {
                  type: "linear",
                }
              : {
                  type: "time",
                  time: {
                    unit: timeUnit,
                    displayFormats: {
                      hour: "HH:mm",
                      minute: "HH:mm",
                      day: "MMM d",
                    },
                  },
                  min: refDatetimeMin.current,
                  max: refDatetimeMax.current,
                }),
          },
          y: {
            grid: {
              // Thicker color when the value is zero
              color: (context) => {
                if (context.tick.value === 0) {
                  return dark
                    ? // slate-500
                      "oklch(55.4% 0.046 257.417)"
                    : // slate-400
                      "oklch(70.4% 0.04 256.788)";
                }
                return dark
                  ? // slate-700
                    "oklch(37.2% 0.044 257.287)"
                  : // slate-200
                    "oklch(92.9% 0.013 255.508)";
              },
              // lineWidth: (context) => {
              //   return context.tick.value === 0 ? 2 : 1;
              // },
            },
            ticks: {
              color: dark
                ? "oklch(86.9% 0.022 252.894)"
                : "oklch(37.2% 0.044 257.287)",
            },
            afterTickToLabelConversion: function ({ ticks }) {
              autoDecimalFormat(ticks);
            },
            title: {
              display: !!unitStr,
              text: unitStr,
              color: dark
                ? "oklch(86.9% 0.022 252.894)"
                : "oklch(37.2% 0.044 257.287)",
            },
            border: {
              display: false,
              // color: "red",
            },
          },
        },
        plugins: {
          // @ts-expect-error - Custom plugin option
          reverseLegend: {
            enabled: !disableInteractiveLegend,
          },
          legend: {
            display: !hideLegends,
            position: "bottom",
            onClick: disableInteractiveLegend ? () => {} : undefined,
            labels: {
              color: dark
                ? "oklch(86.9% 0.022 252.894)"
                : "oklch(37.2% 0.044 257.287)",
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                if (!context.length || isXNumeric || type === "scatter") {
                  return "";
                }
                const date = new Date(context[0].parsed.x);
                return date.toLocaleTimeString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                });
              },
              label: (context) => {
                const label = context.dataset.label || "";
                const yValue = Intl.NumberFormat("tr", {
                  maximumFractionDigits: decimalsMax,
                  minimumFractionDigits: decimalsMin,
                }).format(context.parsed.y);

                const yLabel = unitStr ? `${yValue} ${unitStr}` : yValue;

                if (isXNumeric || type === "scatter") {
                  const xValue = Intl.NumberFormat("tr", {
                    maximumFractionDigits: decimalsMax,
                    minimumFractionDigits: decimalsMin,
                  }).format(context.parsed.x);

                  const xLabel = xAxisUnitStr
                    ? `${xValue} ${xAxisUnitStr}`
                    : xValue;

                  return `${label}: (${xLabel}, ${yLabel})`;
                }

                return `${label}: ${yLabel}`;
              },
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [
    dark,
    individualTooltipMode,
    isXNumeric,
    noRecord,
    seriesAligned,
    type,
    timeUnit,
    hideLegends,
    unitStr,
    xAxisUnitStr,
    decimalsMin,
    decimalsMax,
    maxSpanMins,
    disableInteractiveLegend,
  ]);

  return (
    <div
      className={classNames(
        "p-3 flex justify-center",
        heightFull ? "h-full" : "h-72",
      )}
    >
      {noRecord ? (
        <CNoRecord />
      ) : (
        <div className="relative w-full h-full">
          <canvas ref={ref} />
        </div>
      )}
    </div>
  );
}
