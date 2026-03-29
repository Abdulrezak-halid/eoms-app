import { useContext } from "react";
import { Wifi, WifiOff } from "lucide-react";

import { CIcon } from "@m/core/components/CIcon";
import { CSpinner } from "@m/core/components/CSpinner";
import { ContextWs, WS_PING_MS_UNKNOWN } from "@m/core/contexts/ContextWs";
import { EWsState } from "@m/core/utils/Ws";
import { classNames } from "@m/core/utils/classNames";

export function CWsIndicator() {
  const { state, pingMs } = useContext(ContextWs);

  return (
    <div className="px-3 flex space-x-1">
      {state === EWsState.PENDING_RECONNECTION ||
      state === EWsState.CONNECTING ? (
        <CSpinner className="text-gray-400 dark:text-gray-400" />
      ) : state === EWsState.IDLE ? (
        <CIcon value={WifiOff} className="text-gray-400 dark:text-gray-500" />
      ) : state === EWsState.OPEN ? (
        <>
          {state === EWsState.OPEN && pingMs !== WS_PING_MS_UNKNOWN && (
            <div
              className={classNames(
                "font-mono hidden sm:block",
                pingMs !== WS_PING_MS_UNKNOWN && pingMs >= 200
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-green-600 dark:text-green-400",
              )}
            >
              {pingMs}ms
            </div>
          )}

          <CIcon
            value={Wifi}
            className={
              pingMs !== WS_PING_MS_UNKNOWN && pingMs >= 200
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }
          />
        </>
      ) : (
        <CIcon value={WifiOff} className="text-red-600 dark:text-red-400" />
      )}
    </div>
  );
}
