import { createContext } from "react";

import { IRoutePath } from "@m/core/interfaces/IRoutePath";

import { IRouteExtraData } from "../interfaces/IRouteExtraData";

export const ContextRouteData = createContext<
  { path: IRoutePath } & IRouteExtraData
>({
  path: "/",
});
