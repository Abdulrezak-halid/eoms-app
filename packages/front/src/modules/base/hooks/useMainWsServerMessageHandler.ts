/**
 * @file: useMainWsServerMessageHandler.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 03.02.2026
 * Last Modified Date: 11.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
