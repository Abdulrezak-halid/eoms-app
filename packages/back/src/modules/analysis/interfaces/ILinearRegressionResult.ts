import { IMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";

export type IRegressionResultDataPoint = {
  x: number;
  y: number;
};
export type IRegressionResult = {
  // interpolatedRecordCount: number;
  // interpolateRate: number;
  ignoredRecordCount: number;
  period: IMetricResourceValuePeriod;
  slope: number;
  intercept: number;
  rSquared: number;
  dataPoints: IRegressionResultDataPoint[];
};
