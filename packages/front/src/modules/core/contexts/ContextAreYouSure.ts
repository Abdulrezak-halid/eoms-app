import { createContext } from "react";

export interface IAreYouSureRecord {
  message: string | null;
  cb: () => void | Promise<void>;
  resolver: () => void;
}
export const ContextAreYouSure = createContext({
  items: [] as IAreYouSureRecord[],
  push: (message: string | null, cb: () => void | Promise<void>) => {
    void message;
    void cb;
    return Promise.resolve();
  },
  remove: (item: IAreYouSureRecord) => {
    void item;
  },
});
