import { IUnit } from "common";

export interface IMetricIntegrationOutput {
  outputKey: string;
  metricId: string;
  unit: IUnit;
}
