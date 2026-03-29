export const DataDataViewType = ["METRIC", "METER_SLICE", "SEU"] as const;

export type IDataViewTypeOptions =
  | {
      type: "METRIC";
      metricIds: string[];
    }
  | {
      type: "METER_SLICE";
      meterSliceIds: string[];
    }
  | {
      type: "SEU";
      seuIds: string[];
    };
