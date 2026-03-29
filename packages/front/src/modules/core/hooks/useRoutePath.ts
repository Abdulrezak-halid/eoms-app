import { useLocation } from "wouter";

import { IRoutePath } from "../interfaces/IRoutePath";

export function useRoutePath(): IRoutePath {
  const [location] = useLocation();
  return location as IRoutePath;
}
