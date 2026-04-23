import { InferApiRequest, InferApiResponse } from "@m/base/api/Api";

export type IDtoNeedAndExpectationRequest = InferApiRequest<
  "/u/commitment/need-and-expectation/item",
  "post"
>;

export type IDtoNeedAndExpectationResponse = InferApiResponse<
  "/u/commitment/need-and-expectation/item/{id}",
  "get"
>;
