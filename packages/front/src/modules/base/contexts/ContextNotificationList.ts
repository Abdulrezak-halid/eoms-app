/**
 * @file: ContextNotificationList.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.02.2026
 * Last Modified Date: 25.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createContext } from "react";

import { IAsyncData } from "@m/core/components/CAsyncLoader";

import {
  IDtoNotificationListItem,
  IDtoNotificationResponse,
} from "../interfaces/IDtoNotificationListItem";

export const ContextNotificationList = createContext({
  items: [] as IDtoNotificationListItem[],
  data: {} as IAsyncData<IDtoNotificationResponse>,
  load: async () => {},
});
