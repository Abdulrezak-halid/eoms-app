import { useContext, useEffect } from "react";

import {
  ContextWs,
  IWsServerMessageListener,
} from "@m/core/contexts/ContextWs";

export function useWsServerMessage(cb: IWsServerMessageListener) {
  const { addListener, removeListener } = useContext(ContextWs);

  useEffect(() => {
    addListener(cb);
    return () => {
      removeListener(cb);
    };
  }, [addListener, cb, removeListener]);
}
