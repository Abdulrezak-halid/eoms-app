import { InferApiGetResponse, InferApiPostRequest } from "@m/base/api/Api";

export type IDtoUserRequest = InferApiPostRequest<"/u/base/user/item">;

export type IDtoUserListItem =
  InferApiGetResponse<"/u/base/user/item">["records"][number];

export type IDtoUserResponse = InferApiGetResponse<"/u/base/user/item/{id}">;
