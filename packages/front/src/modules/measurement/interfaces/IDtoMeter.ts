import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoMeterRequest = InferApiRequest<
  "/u/measurement/meter/item",
  "post"
>;

export type IDtoMeterResponse = InferApiResponse<
  "/u/measurement/meter/item/{id}",
  "get"
>;

export type IDtoMeterSaveSliceRequest = InferApiRequest<
  "/u/measurement/meter/slice/{meterId}",
  "post"
>;
