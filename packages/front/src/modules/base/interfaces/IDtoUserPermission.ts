import { InferApiGetResponse, InferApiPutRequest } from "@m/base/api/Api";

export type IDtoUserUserPermissionRequest =
  InferApiPutRequest<"/u/base/user/permission/{userId}">;

export type IDtoUserPermissionResponse =
  InferApiGetResponse<"/u/base/user/permissions/{userId}">;
