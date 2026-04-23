import { IDtoWsServerMessage } from "common/build-api-schema";
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ContextNotificationBalloon } from "@m/core/contexts/ContextNotificationBalloon";
import {
  ContextWs,
  IWsServerMessageListener,
  WS_PING_MS_UNKNOWN,
} from "@m/core/contexts/ContextWs";
import { EWsState, Ws } from "@m/core/utils/Ws";

import { ContextServerMaintenance } from "../contexts/ContextServerMaintenance";
import { ContextSession } from "../contexts/ContextSession";
import { useMainWsServerMessageHandler } from "../hooks/useMainWsServerMessageHandler";

export function CProviderWs({ children }: PropsWithChildren) {
  const [state, setState] = useState(EWsState.IDLE);
  const [pingMs, setPingMs] = useState(WS_PING_MS_UNKNOWN);

  const { push } = useContext(ContextNotificationBalloon);
  const enableMaintenance = useContext(ContextServerMaintenance);

  const { session } = useContext(ContextSession);

  const mainWsServerMessageHandler = useMainWsServerMessageHandler();

  const refListeners = useRef<IWsServerMessageListener[]>([
    mainWsServerMessageHandler,
  ]);

  const addListener = useCallback((cb: IWsServerMessageListener) => {
    refListeners.current.push(cb);
  }, []);
  const removeListener = useCallback((cb: IWsServerMessageListener) => {
    const index = refListeners.current.indexOf(cb);
    if (index !== -1) {
      refListeners.current.splice(index, 1);
    }
  }, []);

  useEffect(() => {
    // TODO better session check needed
    if (!session.userDisplayName) {
      return;
    }

    const ws = new Ws<IDtoWsServerMessage>();
    ws.subscribeState((s) => {
      if (s === EWsState.REJECTED_TRY_AGAIN_LATER) {
        enableMaintenance();
      }
      setState(s);
    });

    ws.subscribePingMs(setPingMs);

    function handleWsServerMessage(msg: IDtoWsServerMessage) {
      for (const cb of refListeners.current) {
        cb(msg);
      }
    }

    ws.subscribeMessage(handleWsServerMessage);

    const protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
    ws.setUrl(`${protocol}//${window.location.host}/api/ws`);
    ws.connect();
    return () => {
      ws.destroy();
    };
  }, [enableMaintenance, push, session.userDisplayName]);

  const contextValue = useMemo(
    () => ({
      state,
      pingMs,
      addListener,
      removeListener,
    }),
    [addListener, pingMs, removeListener, state],
  );

  return (
    <ContextWs.Provider value={contextValue}>{children}</ContextWs.Provider>
  );
}
