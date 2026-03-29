/**
 * @file: ContextSession.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.11.2024
 * Last Modified Date: 06.11.2024
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { SetStateAction, createContext } from "react";

import { InferApiResponse } from "@m/base/api/Api";

export type ISession = NonNullable<
  InferApiResponse<"/g/session", "get">["session"]
>;
export const defaultContextSession: ISession = {
  userId: "",
  userDisplayName: import.meta.env.VITE_NO_LOGIN ? "No-Login" : "",
  userEmail: "",
  orgId: "",
  orgDisplayName: "",
  orgPlan: {
    features: [],
  },
  orgHasBanner: false,
  permissions: [],
  workerVersion: import.meta.env.VITE_NO_LOGIN ? "N/A" : "",
  apiVersion: "",
  workerEnvName: "",
};

export interface IPublicOrganizationInfo {
  displayName: string;
  hasBanner: boolean;
  buildId?: string;
}

export const ContextSession = createContext({
  publicOrganizationInfo: null as IPublicOrganizationInfo | null,
  session: defaultContextSession,
  setSession: (user: SetStateAction<ISession>) => {
    void user;
  },
  clearSession: () => {},
});
