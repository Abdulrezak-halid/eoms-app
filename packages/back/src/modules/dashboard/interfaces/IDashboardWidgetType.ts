export const DataDashboardWidgetType = [
  "ENERGY_POLICY",
  "ENERGY_RESOURCE_PIE_CHART",
  "GRAPH_ADVANCED_REGRESSION_RESULT",
  "GRAPH_DATA_VIEW_VALUE",
  "GRAPH_METRIC",
  "GRAPH_SEU_VALUE",
  "SEU_PIE_CHART",
] as const;

export type IDashboardType = (typeof DataDashboardWidgetType)[number];
