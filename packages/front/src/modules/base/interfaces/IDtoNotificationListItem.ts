import { InferApiGetResponse } from "../api/Api";

export type IDtoNotificationResponse =
  InferApiGetResponse<"/u/core/notification/list">;

export type IDtoNotificationListItem =
  IDtoNotificationResponse["records"][number];
