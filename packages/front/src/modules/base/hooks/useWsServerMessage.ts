/**
 * @file: useWsServerMessage.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 11.02.2026
 * Last Modified Date: 11.02.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
