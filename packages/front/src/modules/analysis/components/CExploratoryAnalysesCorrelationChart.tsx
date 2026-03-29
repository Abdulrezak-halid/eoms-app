import { useCallback } from "react";

import { Api } from "@m/base/api/Api";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CHeatmap, IHeatmapData } from "@m/core/components/CHeatmap";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader, useLoaderMiddleware } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoCorrelationValues } from "../interfaces/IDtoExploratoryAnalyses";

type CorrelationValueItem = IDtoCorrelationValues["values"][number];

export function CExploratoryAnalysesCorrelationChartLoader({
  selectedResultId,
}: {
  selectedResultId: string;
}) {
  const { t } = useTranslation();
  const fetcher = useCallback(async () => {
    return await Api.GET("/u/analysis/correlation/values/{resultId}", {
      params: { path: { resultId: selectedResultId } },
    });
  }, [selectedResultId]);

  const [data] = useLoader(fetcher);

  const middleware = useCallback(
    (payload: IExtractAsyncData<typeof data>) => {
      const allMetrics = payload.result.metrics;

      let dataMatrix: (CorrelationValueItem | null)[][] = [];
      const values = payload.result.values;
      if (allMetrics.length > 0) {
        const metricIds = allMetrics.map((m) => m.id);
        const idToIndex = Object.fromEntries(metricIds.map((id, i) => [id, i]));

        const size = metricIds.length;

        const matrix: (CorrelationValueItem | null)[][] = Array.from(
          { length: size },
          () => Array(size).fill(null),
        );

        if (values) {
          for (const v of values) {
            const i = idToIndex[v.metricAId];
            const j = idToIndex[v.metricBId];
            if (i !== undefined && j !== undefined) {
              matrix[i][j] = v;
              matrix[j][i] = v;
            }
          }
        }

        dataMatrix = matrix;
      }

      const columnLabels = allMetrics.map((d) => d.name);

      const heatmapValues: IHeatmapData[] =
        allMetrics.length === 0
          ? []
          : allMetrics.map((d, rowIndex) => ({
              label: d.name,
              columns: (dataMatrix[rowIndex] ?? []).map((value, colIndex) => {
                let correlationValue: number | null;

                if (rowIndex === colIndex) {
                  correlationValue = null;
                } else if (
                  value?.value !== undefined &&
                  value?.value !== null
                ) {
                  correlationValue = value.value;
                } else {
                  correlationValue = null;
                }

                return {
                  value: correlationValue,
                  description: `${t(
                    "value",
                  )}: ${correlationValue !== null ? correlationValue.toFixed(3) : "-"}`,
                };
              }),
            }));

      return { heatmapValues, columnLabels };
    },
    [t],
  );

  const processedData = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={processedData} className="w-full">
      {(payload) =>
        payload.heatmapValues.length > 0 ? (
          <CHeatmap
            data={payload.heatmapValues}
            columnLabels={payload.columnLabels}
          />
        ) : (
          <CNoRecord />
        )
      }
    </CAsyncLoader>
  );
}

export function CExploratoryAnalysesCorrelationChart({
  selectedResultId,
}: {
  selectedResultId?: string;
}) {
  return (
    <CCard className="min-h-[500px] flex items-center justify-center">
      {selectedResultId ? (
        <CExploratoryAnalysesCorrelationChartLoader
          selectedResultId={selectedResultId}
        />
      ) : (
        <CNoRecord />
      )}
    </CCard>
  );
}
