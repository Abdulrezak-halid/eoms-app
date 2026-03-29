/**
 * @file: IMetricIntegrationOutput.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 20.08.2025
 * Last Modified Date: 22.08.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { IUnit } from "common";

export interface IMetricIntegrationOutput {
  outputKey: string;
  metricId: string;
  unit: IUnit;
}
