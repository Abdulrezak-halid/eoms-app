export type IWidgetConfig =
  | {
      type: "GRAPH_SEU_VALUE";
      seuIds: string[];
    }
  | {
      type: "GRAPH_DATA_VIEW_VALUE";
      dataViewId: string;
    }
  | {
      type: "GRAPH_ADVANCED_REGRESSION_RESULT";
      regressionResultId: string | null;
    }
  | {
      type: "GRAPH_METRIC";
      metricId: string;
    }
  | {
      type: "ENERGY_POLICY";
    }
  | {
      type: "ENERGY_RESOURCE_PIE_CHART";
    }
  | {
      type: "SEU_PIE_CHART";
      seuIds: string[];
    };
