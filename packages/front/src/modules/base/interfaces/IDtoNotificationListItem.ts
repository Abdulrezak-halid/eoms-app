/**
 * @file: IDtoNotificationListItem.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.02.2026
 * Last Modified Date: 25.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { InferApiGetResponse } from "../api/Api";

export type IDtoNotificationResponse =
  InferApiGetResponse<"/u/core/notification/list">;

export type IDtoNotificationListItem =
  IDtoNotificationResponse["records"][number];
