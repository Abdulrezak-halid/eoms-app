/**
 * @file: ContextRouteData.ts
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 05.07.2025
 * Last Modified Date: 05.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { createContext } from "react";

import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { IRouteExtraData } from "../interfaces/IRouteExtraData";

export const ContextRouteData = createContext<
  { path: IRoutePath } & IRouteExtraData
>({
  path: "/",
});
