import { IDtoMetricResourceLabel } from "common/build-api-schema";

import { InferApiGetResponse } from "@m/base/api/Api";

export type ICLabelSelectorValue = IDtoMetricResourceLabel;
export type IMetricLabelSelectorValue = ICLabelSelectorValue;
export type IMetricLabelsResponse =
  InferApiGetResponse<"/u/measurement/metric/labels">;
