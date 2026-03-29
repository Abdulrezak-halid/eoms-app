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
