import { InferApiGetResponse, InferApiPostRequest } from "@m/base/api/Api";

export type IDtoTemplateRequest = InferApiPostRequest<"/u/report/profile/item">;
export type IDtoTemplateResponse =
  InferApiGetResponse<"/u/report/profile/item/{id}">;

export type IDtoTemplateListItem =
  InferApiGetResponse<"/u/report/profile/item">["records"][number];
