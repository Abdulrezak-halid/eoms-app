import { Chart, ScriptableLineSegmentContext, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { useContext, useEffect, useRef } from "react";

import { ContextTheme } from "@m/core/contexts/ContextTheme";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { classNames } from "@m/core/utils/classNames";

Chart.register(...registerables);

export type IMiniChartData = {
  value: number;
  datetime: string;
}[];

export function CMiniChart({
  data,
  // color,
  showPoints,
  noFill,
  clickable,
  className,
  datetimeMin,
  datetimeMax,
}: {
  data: IMiniChartData;
  // color?: string;
  showPoints?: boolean;
  noFill?: boolean;
  clickable?: boolean;
  className?: string;
  datetimeMin?: string;
  datetimeMax?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { dark } = useContext(ContextTheme);

  useEffect(() => {
    if (!ref.current || !data || data.length === 0) {
      return;
    }

    const ctx = ref.current;

    const defaultColor = dark
      ? "oklch(70.7% 0.165 254.624)" // blue-400
      : "oklch(62.3% 0.214 259.815)"; // blue-500

    const lineColor = defaultColor; // color || defaultColor;

    const getBorderColor = (c: ScriptableLineSegmentContext) => {
      const colPositive = lineColor;
      const colNegative = dark
        ? "oklch(71.8% 0.202 349.761)" // pink-400
        : "oklch(65.6% 0.241 354.308)"; // pink-500;

      if (c.p0.parsed.y * c.p1.parsed.y < 0) {
        const chart = (c as unknown as { chart: Chart }).chart;
        // if the segment changes sign from p0 to p1
        const x0 = c.p0.parsed.x,
          x1 = c.p1.parsed.x,
          y0 = c.p0.parsed.y,
          y1 = c.p1.parsed.y,
          //identify the correct axes used for the dataset
          xAxisId = "x",
          yAxisId = "y",
          //transform values to pixels
          x0px = chart.scales[xAxisId].getPixelForValue(x0),
          x1px = chart.scales[xAxisId].getPixelForValue(x1),
          y0px = chart.scales[yAxisId].getPixelForValue(y0),
          y1px = chart.scales[yAxisId].getPixelForValue(y1);

        // create gradient form p0 to p1
        const gradient = chart.ctx.createLinearGradient(x0px, y0px, x1px, y1px);
        // calculate frac - the relative length of the portion of the segment
        // from p0 to the point where the segment intersects the x axis
        const frac = Math.abs(y0) / (Math.abs(y0) + Math.abs(y1));
        // set colors at the ends of the segment
        const [col_p0, col_p1] =
          y0 > 0 ? [colPositive, colNegative] : [colNegative, colPositive];
        gradient.addColorStop(0, col_p0);
        gradient.addColorStop(frac, col_p0);
        gradient.addColorStop(frac, col_p1);
        gradient.addColorStop(1, col_p1);
        return gradient;
      }
      return c.p0.parsed.y >= 0 ? colPositive : colNegative;
    };

    // gradient for fill
    // let gradientFill;
    // if (!noFill) {
    //   const height = ctx.parentElement?.getBoundingClientRect().height;
    //   const context = ctx.getContext("2d");
    //   if (context && height) {
    //     const gradient = context.createLinearGradient(0, 0, 0, height);
    //     gradient.addColorStop(
    //       0,
    //       lineColor.replace("rgb", "rgba").replace(")", ", 0.3)"),
    //     );
    //     gradient.addColorStop(
    //       1,
    //       lineColor.replace("rgb", "rgba").replace(")", ", 0.0)"),
    //     );
    //     gradientFill = gradient;
    //   }
    // }
    // blue-500
    const backgroundColor = "oklch(62.3% 0.214 259.815 / 0.1)";
    // pink-500
    const backgroundColorNegative = "oklch(65.6% 0.241 354.308 / 0.1)";

    const valueMax = Math.max(...data.map((d) => d.value));
    const valueMin = Math.min(...data.map((d) => d.value));

    const padding = Math.abs(valueMax - valueMin) * 0.1;

    let max = valueMax + padding;
    let min = valueMin - padding;

    // if all values are the same (including all zero), create a centered range
    if (max === min) {
      const centerValue = max;
      const defaultRange =
        Math.abs(centerValue) > 0 ? Math.abs(centerValue) : 1;
      max = centerValue + defaultRange / 2;
      min = centerValue - defaultRange / 2;
    }

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            data: data.map((d) => ({
              x: d.datetime,
              y: d.value,
            })),
            // borderColor: lineColor,
            // backgroundColor: gradientFill,
            // backgroundColor,
            // fill: !noFill,
            fill: !noFill && {
              target: "origin",
              above: backgroundColor,
              below: backgroundColorNegative,
            },
            borderWidth: 2,
            pointBackgroundColor: lineColor,
            pointStyle: showPoints ? "circle" : false,
            pointBorderWidth: 0,
            // Note that point radius causes internal padding
            pointRadius: showPoints ? 4 : 0,
            tension: 0.4,

            segment: {
              borderColor: getBorderColor,
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            displayColors: false,
          },
        },
        scales: {
          x: {
            display: false,
            type: "time",
            min: datetimeMin,
            max: datetimeMax,
          },
          // Padding config clips border that's why 1.1 multiplier is used
          //   to leave some space
          y: {
            display: true,
            max,
            min,
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },

            // Make the zero line always visible
            afterBuildTicks: (scale) => {
              scale.ticks = [{ value: 0 }];
            },

            grid: {
              // Zero line color
              color: () => {
                return dark
                  ? // slate-700
                    "oklch(37.2% 0.044 257.287)"
                  : // slate-300
                    "oklch(86.9% 0.022 252.894)";
              },
            },
          },
        },
        interaction: { intersect: false },
        layout: {
          padding: {
            // To hide displayed y scale that is for showing zero line
            left: -10,
          },
        },
      },
    });

    chart.update();

    return () => {
      chart.destroy();
    };
  }, [dark, data, datetimeMax, datetimeMin, noFill, showPoints]);

  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        // overflow-hidden also fixes that, its height grows continuesly like
        //   animation
        "w-full bg-gray-100 dark:bg-gray-900/50 rounded-md overflow-hidden shadow-sm",
        clickable && "hover:bg-white dark:hover:bg-gray-800",
        className,
      )}
    >
      {!data || data.length <= 1 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {t("insufficientData")}
        </div>
      ) : (
        <canvas ref={ref} className="-m-px" />
      )}
    </div>
  );
}
