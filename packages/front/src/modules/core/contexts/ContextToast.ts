/**
 * @file: ContextToast.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 01.11.2024
 * Last Modified Date: 01.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createContext } from "react";

import { IconType } from "../components/CIcon";

export const TOAST_DURATION_SEC = 5;

export type IToastType = "success" | "warning" | "danger" | "info" | "muted";
export interface IToastRecord {
  id: number;
  type: IToastType;
  icon?: IconType;
  message: string;
  timer: number | null;
}

export interface IToastPushOptions {
  controlled?: boolean;
  icon?: IconType;
}

export const ContextToast = createContext({
  items: [] as IToastRecord[],
  push: (
    message: string,
    type?: IToastType,
    options?: IToastPushOptions,
  ): number => {
    void type;
    void message;
    void options;
    return 0;
  },
  remove: (id: number) => {
    void id;
  },
});
