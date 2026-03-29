import { createContext } from "react";

import { IconType } from "../components/CIcon";
import { IRoutePath } from "../interfaces/IRoutePath";

export const NOTIFICATION_BALLOON_DURATION_SEC = 10;

export type INotificationBalloonType =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";
export interface INotificationBalloonRecord {
  id: number;
  type: INotificationBalloonType;
  icon?: IconType;
  message: string;
  timer: number | null;
  creation: number;
  path: IRoutePath;
}

export interface INotificationBalloonPushOptions {
  controlled?: boolean;
  icon?: IconType;
}

export const ContextNotificationBalloon = createContext({
  items: [] as INotificationBalloonRecord[],
  push: (
    message: string,
    path: IRoutePath,
    type?: INotificationBalloonType,
    options?: INotificationBalloonPushOptions,
  ): number => {
    void message;
    void path;
    void type;
    void options;
    return 0;
  },
  remove: (id: number) => {
    void id;
  },
});
