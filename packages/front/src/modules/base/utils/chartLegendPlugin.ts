import type { Chart, ChartEvent, LegendItem, Plugin } from "chart.js";

/**
 * Custom Chart.js plugin for reversed legend behavior.
 *
 * Instead of hiding clicked legend items, this plugin shows ONLY the clicked item
 * and hides all others. Clicking the same item again restores all items.
 *
 * Supports both dataset-based charts (line, bar, scatter) and segment-based charts (pie, doughnut).
 *
 * @usage
 * Enable by setting `reverseLegend: true` in chart options:
 * ```ts
 * {
 *   plugins: {
 *     reverseLegend: { enabled: true }
 *   }
 * }
 * ```
 */
export const reverseLegendPlugin: Plugin = {
  id: "reverseLegend",

  beforeInit(chart: Chart) {
    if (!chart.options.plugins) {
      chart.options.plugins = {};
    }

    if (!chart.options.plugins.legend) {
      chart.options.plugins.legend = {};
    }

    const reverseLegendEnabled = (
      chart.options.plugins as { reverseLegend?: { enabled?: boolean } }
    ).reverseLegend?.enabled;

    if (!reverseLegendEnabled) {
      return;
    }

    chart.options.plugins.legend.onClick = function (
      _e: ChartEvent,
      legendItem: LegendItem,
    ) {
      const { datasetIndex } = legendItem;
      const chartType = "type" in chart.config ? chart.config.type : undefined;

      if (chartType === "pie" || chartType === "doughnut") {
        const clickedIndex = legendItem.index;

        if (clickedIndex === undefined) {
          return;
        }

        const totalDataPoints = chart.data.labels?.length ?? 0;
        if (totalDataPoints === 0) {
          return;
        }

        const visibilityStates = Array.from(
          { length: totalDataPoints },
          (_, i) => chart.getDataVisibility(i),
        );

        const onlyThisVisible =
          visibilityStates[clickedIndex] &&
          visibilityStates.every((visible, i) =>
            i === clickedIndex ? visible : !visible,
          );

        for (let i = 0; i < totalDataPoints; i++) {
          const shouldBeVisible = onlyThisVisible ? true : i === clickedIndex;
          const isVisible = chart.getDataVisibility(i);

          if (shouldBeVisible !== isVisible) {
            chart.toggleDataVisibility(i);
          }
        }

        chart.update();
        return;
      } else {
        if (datasetIndex === undefined) {
          return;
        }

        const datasets = chart.data.datasets;
        const onlyThisVisible = datasets.every((dataset, i) => {
          return i === datasetIndex ? !dataset.hidden : dataset.hidden;
        });

        if (onlyThisVisible) {
          datasets.forEach((dataset) => {
            dataset.hidden = false;
          });
        } else {
          datasets.forEach((dataset, i) => {
            dataset.hidden = i !== datasetIndex;
          });
        }
      }

      chart.update();
    };
  },
};
