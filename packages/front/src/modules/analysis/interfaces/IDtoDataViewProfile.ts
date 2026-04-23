import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoDataViewProfileRequest = InferApiRequest<
  "/u/analysis/data-view/profile",
  "post"
>;

export type IDtoDataViewProfileResponse = InferApiResponse<
  "/u/analysis/data-view/profile/{id}",
  "get"
>;

export type IDtoDataViewProfileValueResponse = InferApiResponse<
  "/u/analysis/data-view/values/{profileId}",
  "get"
>;

export type IDtoEDataViewType = IDtoDataViewProfileRequest["options"]["type"];