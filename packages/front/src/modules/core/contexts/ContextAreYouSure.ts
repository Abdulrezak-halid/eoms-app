/**
 * @file: ContextAreYouSure.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 09.11.2024
 * Last Modified Date: 09.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
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
