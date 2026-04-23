import { IDtoWsServerMessage } from "common/build-api-schema";
import { createContext } from "react";

import { EWsState } from "../utils/Ws";

export const WS_PING_MS_UNKNOWN = -1;

export type IWsServerMessageListener = (msg: IDtoWsServerMessage) => void;

export const ContextWs = createContext({
  state: EWsState.IDLE,
  pingMs: WS_PING_MS_UNKNOWN,
  addListener: (cb: IWsServerMessageListener) => {
    void cb;
  },
  removeListener: (cb: IWsServerMessageListener) => {
    void cb;
  },
});
