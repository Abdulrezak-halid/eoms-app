import { useTranslate } from "@tolgee/react";
import {
  Chart,
  ChartData,
  ChartOptions,
  Plugin,
  TooltipItem,
  registerables,
} from "chart.js";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { IUnit, UtilUnit } from "common";
import { useContext, useEffect, useMemo, useRef } from "react";

import {
  IChartDataColor,
  chartColorInfos,
  defaultChartColors,
} from "@m/base/utils/chartColors";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { ContextTheme } from "@m/core/contexts/ContextTheme";

Chart.register(...registerables);

export type IPieChartDataSingle = {
  label: string;
  value: number;
  color?: IChartDataColor;
}[];

export type IPieChartDataMulti = {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

function isMultiSeries(
  data: IPieChartDataSingle | IPieChartDataMulti,
): data is IPieChartDataMulti {
  return (data as IPieChartDataMulti).series !== undefined;
}

export function CPieChart({
  data,
  isDoughnut = false,
  unit,
  disableInteractiveLegend,
}: {
  data?: IPieChartDataSingle | IPieChartDataMulti;
  isDoughnut?: boolean;
  unit?: IUnit;
  disableInteractiveLegend?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const { dark } = useContext(ContextTheme);
  const { t } = useTranslate();

  const noRecord = useMemo(() => {
    if (!data) {
      return true;
    }
    if (isMultiSeries(data)) {
      return data.series.length === 0;
    }
    return data.length === 0;
  }, [data]);

  useEffect(() => {
    if (!ref.current || noRecord || !data) {
      return;
    }

    const ctx = ref.current;
    let chartData: ChartData;
    let chartOptions: ChartOptions;

    const commonLegendOptions = {
      position: "top" as const,
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
    };

    function formatValue(value: number) {
      return Intl.NumberFormat("tr", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(value);
    }

    const unitStr = unit ? UtilUnit.getAbbreviation(unit, t) : "";

    const datalabelsOptions = {
      color: dark ? "black" : "oklch(20.8% 0.042 265.755)",
      textAlign: "center" as const,
      display: "auto" as const,
      formatter: (value: number, context: Context) => {
        if (!value) {
          return null;
        }

        const dataset = context.dataset.data as number[];
        const total = dataset.reduce((sum, val) => sum + (val || 0), 0);
        const percentage = total > 0 ? (value / total) * 100 : 0;

        // hide label entirely if slice is too small to prevent overlap
        if (percentage < 4) {
          return null;
        }

        const formattedValue = formatValue(value);
        const formattedPercentage = formatValue(percentage);

        return unitStr
          ? [`${formattedValue} ${unitStr}`, `(${formattedPercentage}%)`]
          : [`${formattedValue}`, `(${formattedPercentage}%)`];
      },
      font: {
        size: 14,
        weight: "bold" as const,
      },
    };

    const tooltipOptions = {
      callbacks: {
        label: (context: TooltipItem<"pie" | "doughnut">) => {
          const value = context.parsed;
          if (value === null || value === undefined) {
            return "";
          }

          const dataset = context.dataset.data;
          const total = dataset.reduce((sum, val) => sum + (val || 0), 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;

          const formattedValue = formatValue(value);
          const formattedPercentage = formatValue(percentage);

          const valStr = unitStr
            ? `${formattedValue} ${unitStr}`
            : formattedValue;
          return ` ${context.label}: ${valStr} (${formattedPercentage}%)`;
        },
      },
    };

    if (isMultiSeries(data)) {
      const colors = data.labels.map((_, i) => {
        const colorName = defaultChartColors[i % defaultChartColors.length];
        return dark
          ? chartColorInfos[colorName].dark
          : chartColorInfos[colorName].light;
      });

      chartData = {
        labels: data.labels,
        datasets: data.series.map((s) => ({
          label: s.name,
          data: s.data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: dark ? "#1a1a1a" : "#fff",
        })),
      };
      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: commonLegendOptions,
          datalabels: datalabelsOptions,
          tooltip: tooltipOptions,
        },
      };
    } else {
      chartData = {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((d, i) => {
              const colorName =
                d.color || defaultChartColors[i % defaultChartColors.length];
              return dark
                ? chartColorInfos[colorName].dark
                : chartColorInfos[colorName].light;
            }),
            borderWidth: 2,
            borderColor: dark ? "#1a1a1a" : "#fff",
          },
        ],
      };
      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: commonLegendOptions,
          datalabels: datalabelsOptions,
          tooltip: tooltipOptions,
        },
        cutout: isDoughnut ? "50%" : undefined,
      } as ChartOptions<"doughnut">;
    }

    const chart = new Chart(ctx, {
      type: isDoughnut ? "doughnut" : "pie",
      data: chartData,
      options: chartOptions,
      plugins: [ChartDataLabels as unknown as Plugin<"pie" | "doughnut">],
    });

    return () => chart.destroy();
  }, [dark, noRecord, data, isDoughnut, unit, t, disableInteractiveLegend]);

  return (
    <div className="p-3 flex min-h-80 justify-center">
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
