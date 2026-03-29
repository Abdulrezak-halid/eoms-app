import { ITimedValue } from "@m/core/interfaces/ITimedValue";
import { IMetricResourceValuePeriod } from "@m/measurement/interfaces/IMetricResourceValuePeriod";

export type IAdvancedRegressionResult = {
  // Meter + driver records
  // trainRecordInterpolatedCount: number;
  // trainRecordInterpolateRate: number;
  trainRecordIgnoredCount: number;

  // Only driver records
  // predictRecordInterpolatedCount: number;
  // predictRecordInterpolateRate: number;
  // predictRecordIgnoredCount: number;

  period: IMetricResourceValuePeriod;

  rSquared: number | null;
  rmse: number;

  expectedValues: ITimedValue[];
  observedValues: ITimedValue[];
  differenceValues: ITimedValue[];
  cumulativeDifferenceValues: ITimedValue[];

  sourceMeterSlices: {
    id: string;
    values: ITimedValue[];
  }[];
  sourceDrivers: {
    id: string;
    values: ITimedValue[];
  }[];
};
