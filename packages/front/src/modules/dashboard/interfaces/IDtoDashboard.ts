import { InferApiResponse } from "@m/base/api/Api";

export type IDtoWidgetListResponse = InferApiResponse<
  "/u/dashboard/widget/item",
  "get"
>;

export type IDtoWidgetResponse = InferApiResponse<
  "/u/dashboard/widget/item/{id}",
  "get"
>;

export type IDtoWidgetConfig = IDtoWidgetResponse["config"];

export type IDtoWidgetConfigSeu = Extract<
  IDtoWidgetConfig,
  { type: "GRAPH_SEU_VALUE" }
>;

export type IDtoWidgetConfigDataView = Extract<
  IDtoWidgetConfig,
  { type: "GRAPH_DATA_VIEW_VALUE" }
>;

export type IDtoWidgetConfigRegression = Extract<
  IDtoWidgetConfig,
  { type: "GRAPH_ADVANCED_REGRESSION_RESULT" }
>;

export type IDtoWidgetConfigMetric = Extract<
  IDtoWidgetConfig,
  { type: "GRAPH_METRIC" }
>;

export type IDtoWidgetConfigEnergyPolicy = Extract<
  IDtoWidgetConfig,
  { type: "ENERGY_POLICY" }
>;

export type IDtoWidgetConfigEnergyResourcePieChart = Extract<
  IDtoWidgetConfig,
  { type: "ENERGY_RESOURCE_PIE_CHART" }
>;

export type IDtoWidgetConfigSeuPieChart = Extract<
  IDtoWidgetConfig,
  { type: "SEU_PIE_CHART" }
>;
