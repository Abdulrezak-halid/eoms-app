import { IDtoWsServerMessage } from "common/build-api-schema";
import { PropsWithChildren, useCallback, useMemo } from "react";

import { useLoader } from "@m/core/hooks/useLoader";

import { Api } from "../api/Api";
import { ContextNotificationList } from "../contexts/ContextNotificationList";
import { useWsServerMessage } from "../hooks/useWsServerMessage";

export function CProviderNotificationList({ children }: PropsWithChildren) {
  const fetcher = useCallback(async () => {
    return await Api.GET("/u/core/notification/list");
  }, []);

  const [data, load] = useLoader(fetcher);

  const wsListener = useCallback(
    (msg: IDtoWsServerMessage) => {
      if (msg.type === "NOTIFICATION") {
        void load();
      }
    },
    [load],
  );

  useWsServerMessage(wsListener);

  const value = useMemo(
    () => ({
      data,
      items: data.payload?.records || [],
      load,
    }),
    [data, load],
  );

  return (
    <ContextNotificationList.Provider value={value}>
      {children}
    </ContextNotificationList.Provider>
  );
}
