import { IDtoWsServerMessage } from "common/build-api-schema";
import { useCallback, useContext } from "react";

import { ContextNotificationBalloon } from "@m/core/contexts/ContextNotificationBalloon";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { renderNotificationMessage } from "../utils/renderNotificationMessage";

export function useMainWsServerMessageHandler() {
  const { t } = useTranslation();

  const { push } = useContext(ContextNotificationBalloon);

  return useCallback(
    (msg: IDtoWsServerMessage) => {
      switch (msg.type) {
        case "NOTIFICATION": {
          const notification = renderNotificationMessage(msg.content, t);
          push(notification.message, notification.path);
        }
      }
    },
    [push, t],
  );
}
